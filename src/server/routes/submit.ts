import { Router } from "express";
import { jobQueue } from "../queue";
import IORedis from "ioredis";
import { JobData } from "../../types/job";

const redis = new IORedis();
const router = Router();

router.post("/", async (req, res) => {
  const { org_id, app_version_id, test_path, target } = req.body as JobData;

  const activeTargets = await redis.smembers("active_targets");
  console.log(activeTargets);
  

  if (!activeTargets.includes(target)) {
    return res.status(400).json({
      error: `No active worker available for target "${target}". Available: ${activeTargets.join(
        ", "
      )}`,
    });
    console.log(activeTargets);
  }

  const orgPriorities: Record<string, number> = {
    qualgent: 1,
    internal: 2,
    default: 5,
  };
  const effectivePriority = orgPriorities[org_id] || orgPriorities.default;

  // prevent duplicate jobs
  const lockKey = `joblock:${org_id}:${app_version_id}:${test_path}:${target}`;
  const lock = await redis.set(lockKey, "locked", "EX", 30, "NX");

  if (!lock) {
    console.log("Duplicate job detected");
    return res
      .status(409)
      .json({ error: "Duplicate job already exists or was just submitted" });
  }

  try {
    const job = await jobQueue.add(
      "run-test",
      {
        org_id,
        app_version_id,
        test_path,
        target,
        priority: effectivePriority,
      },
      {
        attempts: 3,
        priority: effectivePriority,
      }
    );

    res.json({ job_id: job.id });
  } catch (err) {
    // Clean up Redis lock if job fails to queue
    await redis.del(lockKey);
    console.error("Failed to add job:", (err as any).message);
    res.status(500).json({ error: "Failed to queue job" });
  }
});

export default router;
