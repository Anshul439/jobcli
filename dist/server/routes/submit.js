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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const queue_1 = require("../queue");
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default();
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { org_id, app_version_id, test_path, target } = req.body;
    const orgPriorities = {
        qualgent: 1,
        internal: 2,
        default: 5,
    };
    const effectivePriority = orgPriorities[org_id] || orgPriorities.default;
    // prevent duplicate jobs
    const lockKey = `joblock:${org_id}:${app_version_id}:${test_path}:${target}`;
    const lock = yield redis.set(lockKey, 'locked', 'NX', 'EX', 30); // 30 sec lock
    if (!lock) {
        console.log("Duplicate job detected");
        return res.status(409).json({ error: "Duplicate job already exists or was just submitted" });
    }
    try {
        const job = yield queue_1.jobQueue.add("run-test", {
            org_id,
            app_version_id,
            test_path,
            target,
            priority: effectivePriority,
        }, {
            attempts: 3,
            priority: effectivePriority
        });
        res.json({ job_id: job.id });
    }
    catch (err) {
        // Clean up Redis lock if job fails to queue
        yield redis.del(lockKey);
        console.error("Failed to add job:", err.message);
        res.status(500).json({ error: "Failed to queue job" });
    }
}));
exports.default = router;
