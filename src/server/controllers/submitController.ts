import { Request, Response } from "express";
import redis from "../utils/redis";
import { JobData } from "../../types/job";
import { getTargetQueue } from "../queue";

const connection = redis;

export const submitJob = async (req: Request, res: Response) => {
  const { org_id, app_version_id, test_path, target } = req.body as JobData;

  const activeTargets = await connection.smembers("active_targets");

  if (!activeTargets.includes(target)) {
    return res.status(400).json({
      error: `No active worker available for target "${target}". Available: ${activeTargets.join(
        ", "
      )}`,
    });
  }

  const orgPriorities: Record<string, number> = {
    qualgent: 1,
    internal: 2,
    default: 5,
  };
  const effectivePriority = orgPriorities[org_id] || orgPriorities.default;

  const lockKey = `joblock:${org_id}:${app_version_id}:${test_path}:${target}`;
  const lock = await connection.set(lockKey, "locked", "EX", 30, "NX");

  if (!lock) {
    return res
      .status(409)
      .json({ error: "Duplicate job already exists or was just submitted" });
  }

  try {
    const queue = getTargetQueue(target);
    const job = await queue.add(
      "run-test",
      {
        org_id,
        app_version_id,
        test_path,
        target,
        priority: effectivePriority,
      },
      { attempts: 3, priority: effectivePriority }
    );

    res.json({ job_id: job.id, target });
  } catch (err) {
    await connection.del(lockKey);
    res.status(500).json({ error: "Failed to queue job" });
  }
};
