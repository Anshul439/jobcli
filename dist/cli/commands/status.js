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
const commander_1 = require("commander");
const axios_1 = __importDefault(require("axios"));
const status = new commander_1.Command("status");
status
    .requiredOption("--job-id <job_id>", "Job ID to check")
    .requiredOption("--target <target>", "Target device")
    .action((opts) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const res = yield axios_1.default.get(`http://localhost:3000/status/${opts.jobId}`, {
            params: {
                target: opts.target,
            },
        });
        const { state, attempts } = res.data;
        console.log(`Job Status: ${state} (Attempts: ${attempts})`);
    }
    catch (err) {
        if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
            console.error(`Job ${opts.jobId} not found on target "${opts.target}"`);
        }
        else {
            console.error("Error:", err.message);
        }
        process.exit(1);
    }
}));
exports.default = status;
