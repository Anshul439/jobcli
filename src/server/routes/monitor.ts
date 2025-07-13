import { Router } from "express";
import { jobQueue } from "../queue";

const router = Router();

router.get('/jobs/summary', async (_, res) => {
  const counts = {
    waiting: await jobQueue.getPrioritizedCount(),
    active: await jobQueue.getActiveCount(),
    completed: await jobQueue.getCompletedCount(),
    failed: await jobQueue.getFailedCount()
  };
  res.json(counts);
});

router.get('/jobs/queue', async (_, res) => {
  const waitingJobs = await jobQueue.getPrioritized(0, -1);
  const activeJobs = await jobQueue.getActive(0, -1);
  const delayedJobs = await jobQueue.getDelayed(0, -1);

  const formatJob = (job: any, state: string) => ({
    id: job.id,
    org_id: job.data.org_id,
    test_path: job.data.test_path,
    target: job.data.target,
    priority: job.opts.priority,
    state,
    attemptsMade: job.attemptsMade,
    timestamp: job.timestamp
  });

  const jobs = [
    ...activeJobs.map((j) => formatJob(j, 'active')),
    ...waitingJobs.map((j) => formatJob(j, 'waiting')),
    ...delayedJobs.map((j) => formatJob(j, 'delayed'))
  ];

  // Sort by priority (asc), then timestamp (asc)
  jobs.sort((a, b) => {
    if (a.priority === b.priority) {
      return a.timestamp - b.timestamp;
    }
    return a.priority - b.priority;
  });

  res.json(jobs);
});


export default router;