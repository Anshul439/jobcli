"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueDetails = exports.getJobSummary = void 0;
const queue_1 = require("../queue");
const targets = ["device", "emulator", "browserstack"];
const getJobSummary = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const counts = {
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0,
    };
    for (const target of targets) {
        const queue = (0, queue_1.getTargetQueue)(target);
        counts.waiting += yield queue.getPrioritizedCount();
        counts.active += yield queue.getActiveCount();
        counts.completed += yield queue.getCompletedCount();
        counts.failed += yield queue.getFailedCount();
    }
    res.json(counts);
});
exports.getJobSummary = getJobSummary;
const getQueueDetails = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobs = [];
    const formatJob = (job, state) => ({
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
        const queue = (0, queue_1.getTargetQueue)(target);
        const activeJobs = yield queue.getActive(0, -1);
        const waitingJobs = yield queue.getPrioritized(0, -1);
        const delayedJobs = yield queue.getDelayed(0, -1);
        jobs.push(...activeJobs.map((j) => formatJob(j, "active")), ...waitingJobs.map((j) => formatJob(j, "waiting")), ...delayedJobs.map((j) => formatJob(j, "delayed")));
    }
    // Sort by priority (asc), then timestamp (asc)
    jobs.sort((a, b) => {
        if (a.priority === b.priority) {
            return a.timestamp - b.timestamp;
        }
        return a.priority - b.priority;
    });
    res.json(jobs);
});
exports.getQueueDetails = getQueueDetails;
