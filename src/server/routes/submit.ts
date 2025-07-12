import { Router } from 'express';
import { jobQueue } from '../queue';

const router = Router();

router.post('/', async (req, res) => {
  const { org_id, app_version_id, test_path, priority = 1, target = 'emulator' } = req.body;

  const job = await jobQueue.add('run-test', {
    org_id,
    app_version_id,
    test_path,
    priority,
    target
  }, {
    attempts: 3,
    priority
  });

  res.json({ job_id: job.id });
});

export default router;
