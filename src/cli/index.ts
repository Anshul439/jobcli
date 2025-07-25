#!/usr/bin/env node

import { Command } from 'commander';
import submitCommand from './commands/submit';
import statusCommand from './commands/status';

const program = new Command();

program
  .name('jobcli')
  .description('CLI for Submitting and Managing Distributed Jobs')
  .version('1.0.0');

program.addCommand(submitCommand);
program.addCommand(statusCommand);

program.parse(process.argv);
