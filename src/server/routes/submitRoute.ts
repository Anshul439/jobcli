import { Router } from "express";
import { submitJob } from "../controllers/submitController";

const router = Router();

router.post("/", submitJob);

export default router;
