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
const express_1 = require("express");
const queue_1 = require("../queue");
const router = (0, express_1.Router)();
router.get('/jobs/summary', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const counts = {
        waiting: yield queue_1.jobQueue.getWaitingCount(),
        active: yield queue_1.jobQueue.getActiveCount(),
        completed: yield queue_1.jobQueue.getCompletedCount(),
        failed: yield queue_1.jobQueue.getFailedCount()
    };
    res.json(counts);
}));
exports.default = router;
