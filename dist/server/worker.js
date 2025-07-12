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
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const connection = new ioredis_1.default({ maxRetriesPerRequest: null });
const worker = new bullmq_1.Worker('test-jobs', (job) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`🚀 Running test: ${job.data.test_path}`);
    yield new Promise(res => setTimeout(res, 10000));
    if (Math.random() < 0.2)
        throw new Error('❌ Simulated test failure');
}), { connection });
worker.on('completed', job => console.log(`✅ Job ${job.id} completed`));
worker.on('failed', (job, err) => console.log(`❌ Job ${job === null || job === void 0 ? void 0 : job.id} failed: ${err.message}`));
