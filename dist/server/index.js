"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const submitRoute_1 = __importDefault(require("./routes/submitRoute"));
const statusRoute_1 = __importDefault(require("./routes/statusRoute"));
const monitorRoute_1 = __importDefault(require("./routes/monitorRoute"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/submit', submitRoute_1.default);
app.use('/status', statusRoute_1.default);
app.use('/monitor', monitorRoute_1.default);
app.get('/health', (_, res) => res.send('OK'));
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
