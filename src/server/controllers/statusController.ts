import { Request, Response } from "express";
import { jobQueue } from "../queue";

export const getJobStatus = async (req: Request, res: Response) => {
  const job = await jobQueue.getJob(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });

  const state = await job.getState();
  const attempts = job.attemptsMade;

  res.json({
    job_id: job.id,
    state,
    attempts,
  });
};
