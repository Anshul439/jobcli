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
exports.getJobStatus = void 0;
const queue_1 = require("../queue");
const getJobStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { target } = req.query;
    if (!target || typeof target !== "string") {
        return res
            .status(400)
            .json({ error: "Target is required to locate the job" });
    }
    const queue = (0, queue_1.getTargetQueue)(target);
    const job = yield queue.getJob(id);
    if (!job)
        return res.status(404).json({ error: "Job not found" });
    const state = yield job.getState();
    const attempts = job.attemptsMade;
    res.json({ job_id: job.id, state, attempts });
});
exports.getJobStatus = getJobStatus;
