"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const submit_1 = __importDefault(require("./routes/submit"));
const status_1 = __importDefault(require("./routes/status"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/submit', submit_1.default);
app.use('/status', status_1.default);
app.get('/health', (_, res) => res.send('OK'));
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
