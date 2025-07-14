import { Request, Response } from "express";
import redis from "../utils/redis";
import { jobQueue } from "../queue";
import { JobData } from "../../types/job";

const connection = redis;

export const submitJob = async (req: Request, res: Response) => {
  const { org_id, app_version_id, test_path, target } = req.body as JobData;

  const activeTargets = await connection.smembers("active_targets");
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
  const lock = await connection.set(lockKey, "locked", "EX", 30, "NX");

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
    await connection.del(lockKey);
    console.error("Failed to add job:", (err as any).message);
    res.status(500).json({ error: "Failed to queue job" });
  }
};
