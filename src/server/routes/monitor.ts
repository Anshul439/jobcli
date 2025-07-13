import { Router } from "express";
import { jobQueue } from "../queue";

const router = Router();

router.get('/jobs/summary', async (_, res) => {
  const counts = {
    waiting: await jobQueue.getWaitingCount(),
    active: await jobQueue.getActiveCount(),
    completed: await jobQueue.getCompletedCount(),
    failed: await jobQueue.getFailedCount()
  };
  res.json(counts);
});

export default router;