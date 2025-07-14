import { Router } from "express";
import { getJobSummary, getQueueDetails } from "../controllers/monitorController";

const router = Router();

router.get("/jobs/summary", getJobSummary);
router.get("/jobs/queue", getQueueDetails);

export default router;
