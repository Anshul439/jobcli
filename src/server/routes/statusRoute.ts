import { Router } from "express";
import { getJobStatus } from "../controllers/statusController";

const router = Router();

router.get("/:id", getJobStatus);

export default router;
