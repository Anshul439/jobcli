"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const submit_1 = __importDefault(require("./commands/submit"));
const status_1 = __importDefault(require("./commands/status"));
const program = new commander_1.Command();
program
    .name('qgjob')
    .description('QualGent CLI')
    .version('1.0.0');
program.addCommand(submit_1.default);
program.addCommand(status_1.default);
program.parse(process.argv);
