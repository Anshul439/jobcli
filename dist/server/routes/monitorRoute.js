"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const monitorController_1 = require("../controllers/monitorController");
const router = (0, express_1.Router)();
router.get("/jobs/summary", monitorController_1.getJobSummary);
router.get("/jobs/queue", monitorController_1.getQueueDetails);
exports.default = router;
