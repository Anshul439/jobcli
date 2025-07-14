"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = __importDefault(require("./utils/redis"));
const connection = redis_1.default;
exports.jobQueue = new bullmq_1.Queue('test-jobs', { connection });
