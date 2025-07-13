import { Command } from 'commander';
import axios from 'axios';
import { StatusOptions } from '../../types/cli';

const status = new Command('status');

status
  .requiredOption('--job-id <job_id>', 'Job ID to check')
  .action(async (opts: StatusOptions ) => {
    try {
      const res = await axios.get(`http://localhost:3000/status/${opts.jobId}`);
      console.log(`Job Status: ${res.data.state} (Attempts: ${res.data.attempts})`);
    } catch (err) {
      console.error('Error:', (err as any).message);
    }
  });

export default status;
