import { Command } from 'commander';
import axios from 'axios';

const submit = new Command('submit');

submit
  .requiredOption('--org-id <org_id>', 'Organization ID')
  .requiredOption('--app-version-id <app_version_id>', 'App version ID')
  .requiredOption('--test <test_path>', 'Test path')
  .option('--target <target>', 'Target device', 'emulator')
  .action(async (opts) => {
    const res = await axios.post('http://localhost:3000/submit', {
      org_id: opts.orgId,
      app_version_id: opts.appVersionId,
      test_path: opts.test,
      target: opts.target
    });
    console.log('Job submitted. ID:', res.data.job_id);
  });

export default submit;
