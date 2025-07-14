"use strict";
// console.log("👷‍♂️ Worker booting...");
// console.log("AGENT_TARGET =", process.env.AGENT_TARGET);
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
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default();
const connection = new ioredis_1.default({ maxRetriesPerRequest: null });
const AGENT_TARGET = process.env.AGENT_TARGET;
console.log(AGENT_TARGET);
if (!AGENT_TARGET || !['emulator', 'device', 'browserstack'].includes(AGENT_TARGET)) {
    console.error("AGENT_TARGET must be one of: emulator, device, browserstack");
    process.exit(1);
}
console.log(`Starting worker for target: ${AGENT_TARGET}`);
const worker = new bullmq_1.Worker("test-jobs", (job) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("HIII");
    if (job.data.target !== AGENT_TARGET) {
        console.log(`Skipping job ${job.id} — target ${job.data.target} ≠ ${AGENT_TARGET}`);
        throw new Error('Target mismatch');
    }
    yield redis.sadd("active_targets", AGENT_TARGET);
    console.log(AGENT_TARGET);
    const { org_id, app_version_id, test_path, target } = job.data;
    const isInstalled = yield redis.sismember("installed_versions", app_version_id);
    if (!isInstalled) {
        console.log(`[${AGENT_TARGET}] Installing ${app_version_id}`);
        yield new Promise((r) => setTimeout(r, 1000));
        yield redis.sadd("installed_versions", app_version_id);
    }
    console.log(`[${AGENT_TARGET}] Running ${test_path}`);
    yield new Promise((res) => setTimeout(res, 5000));
}), {
    connection,
    concurrency: 1
});
worker.on("completed", (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { org_id, app_version_id, test_path, target } = job.data;
    const lockKey = `joblock:${org_id}:${app_version_id}:${test_path}:${target}`;
    yield redis.del(lockKey);
    console.log(`[${AGENT_TARGET}] Job ${job.id} completed`);
}));
worker.on("failed", (job, err) => __awaiter(void 0, void 0, void 0, function* () {
    const { org_id, app_version_id, test_path, target } = job.data;
    const lockKey = `joblock:${org_id}:${app_version_id}:${test_path}:${target}`;
    yield redis.del(lockKey);
    console.log(`[${AGENT_TARGET}] Job ${job === null || job === void 0 ? void 0 : job.id} failed: ${err.message}`);
}));
