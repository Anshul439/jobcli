import { Request, Response } from "express";
import { getTargetQueue } from "../queue";

export const getJobStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { target } = req.query;

  if (!target || typeof target !== "string") {
    return res
      .status(400)
      .json({ error: "Target is required to locate the job" });
  }

  const queue = getTargetQueue(target);
  const job = await queue.getJob(id as string);

  if (!job) return res.status(404).json({ error: "Job not found" });

  const state = await job.getState();
  const attempts = job.attemptsMade;

  res.json({ job_id: job.id, state, attempts });
};
