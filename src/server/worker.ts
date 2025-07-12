import { Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({ maxRetriesPerRequest: null });

const worker = new Worker('test-jobs', async job => {
  console.log(`🚀 Running test: ${job.data.test_path}`);
  await new Promise(res => setTimeout(res, 10000));

  if (Math.random() < 0.2) throw new Error('❌ Simulated test failure');
}, { connection });

worker.on('completed', job => console.log(`✅ Job ${job.id} completed`));
worker.on('failed', (job, err) => console.log(`❌ Job ${job?.id} failed: ${err.message}`));
