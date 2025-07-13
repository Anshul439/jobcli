"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_arena_1 = __importDefault(require("bull-arena"));
const bullmq_1 = require("bullmq");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const arenaConfig = (0, bull_arena_1.default)({
    BullMQ: bullmq_1.Queue,
    queues: [
        {
            type: 'bullmq',
            name: 'test-jobs',
            hostId: 'QualGent Worker',
            connection: {
                host: '127.0.0.1',
                port: 6379
            }
        }
    ]
}, {
    basePath: '/arena',
    disableListen: true
});
app.use('/', arenaConfig);
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Arena dashboard available at http://localhost:${PORT}/arena`);
});
