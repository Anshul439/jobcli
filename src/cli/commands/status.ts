import { Command } from "commander";
import axios from "axios";
import { StatusOptions } from "../../types/cli";

const status = new Command("status");

status
  .requiredOption("--job-id <job_id>", "Job ID to check")
  .requiredOption("--target <target>", "Target device")
  .action(async (opts: StatusOptions) => {
    try {
      const res = await axios.get(`http://localhost:3000/status/${opts.jobId}`, {
        params: {
          target: opts.target,
        },
      });
      
      const { state, attempts } = res.data;
      console.log(`Job Status: ${state} (Attempts: ${attempts})`);
      
    } catch (err: any) {
      if (err.response?.status === 404) {
        console.error(`Job ${opts.jobId} not found on target "${opts.target}"`);
      } else {
        console.error("Error:", err.message);
      }
      process.exit(1);
    }
  });

export default status;