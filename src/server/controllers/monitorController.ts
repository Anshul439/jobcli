import { Request, Response } from "express";
import { jobQueue } from "../queue";
import { QueuedJob, JobSummary } from "../../types/job";

export const getJobSummary = async (_: Request, res: Response) => {
  const counts: JobSummary = {
    waiting: await jobQueue.getPrioritizedCount(),
    active: await jobQueue.getActiveCount(),
    completed: await jobQueue.getCompletedCount(),
    failed: await jobQueue.getFailedCount(),
  };
  res.json(counts);
};

export const getQueueDetails = async (_: Request, res: Response) => {
  const waitingJobs = await jobQueue.getPrioritized(0, -1);
  const activeJobs = await jobQueue.getActive(0, -1);
  const delayedJobs = await jobQueue.getDelayed(0, -1);

  const formatJob = (job: any, state: string): QueuedJob => ({
    id: job.id,
    org_id: job.data.org_id,
    test_path: job.data.test_path,
    target: job.data.target,
    priority: job.opts.priority,
    state,
    attemptsMade: job.attemptsMade,
    timestamp: job.timestamp,
  });

  const jobs = [
    ...activeJobs.map((j) => formatJob(j, "active")),
    ...waitingJobs.map((j) => formatJob(j, "waiting")),
    ...delayedJobs.map((j) => formatJob(j, "delayed")),
  ];

  // Sort by priority (asc), then timestamp (asc)
  jobs.sort((a, b) => {
    if (a.priority === b.priority) {
      return a.timestamp - b.timestamp;
    }
    return a.priority - b.priority;
  });

  res.json(jobs);
};
