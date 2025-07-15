import { Request, Response } from "express";
import { getTargetQueue } from "../queue";
import { QueuedJob, JobSummary } from "../../types/job";

const targets = ["device", "emulator", "browserstack"];

export const getJobSummary = async (_: Request, res: Response) => {
  const counts: JobSummary = {
    waiting: 0,
    active: 0,
    completed: 0,
    failed: 0,
  };

  for (const target of targets) {
    const queue = getTargetQueue(target);
    counts.waiting += await queue.getPrioritizedCount();
    counts.active += await queue.getActiveCount();
    counts.completed += await queue.getCompletedCount();
    counts.failed += await queue.getFailedCount();
  }

  res.json(counts);
};

export const getQueueDetails = async (_: Request, res: Response) => {
  const jobs: QueuedJob[] = [];

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

  for (const target of targets) {
    const queue = getTargetQueue(target);

    const activeJobs = await queue.getActive(0, -1);
    const waitingJobs = await queue.getPrioritized(0, -1);
    const delayedJobs = await queue.getDelayed(0, -1);

    jobs.push(
      ...activeJobs.map((j) => formatJob(j, "active")),
      ...waitingJobs.map((j) => formatJob(j, "waiting")),
      ...delayedJobs.map((j) => formatJob(j, "delayed"))
    );
  }

  // Sort by priority (asc), then timestamp (asc)
  jobs.sort((a, b) => {
    if (a.priority === b.priority) {
      return a.timestamp - b.timestamp;
    }
    return a.priority - b.priority;
  });

  res.json(jobs);
};
