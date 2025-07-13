import { Worker } from "bullmq";
import IORedis from "ioredis";

const redis = new IORedis();

const connection = new IORedis({ maxRetriesPerRequest: null });

const worker = new Worker(
  "test-jobs",
  async (job) => {
    const { app_version_id } = job.data;
    console.log(app_version_id);

    const isInstalled = await redis.sismember(
      "installed_versions",
      app_version_id
    );
    console.log(isInstalled);

    if (!isInstalled) {
      console.log(`[Worker] Installing app version: ${app_version_id}...`);
      await new Promise((r) => setTimeout(r, 1000)); // Simulate install
      await redis.sadd("installed_versions", app_version_id);
    } else {
      console.log(
        `[Worker] Skipping install for app version ${app_version_id}`
      );
    }

    console.log(`Running test: ${job.data.test_path}`);
    await new Promise((res) => setTimeout(res, 5000));

    // if (Math.random() < 0.2) throw new Error("Simulated test failure");
  },
  { connection }
);

worker.on("completed", (job) => console.log(`Job ${job.id} completed`));
worker.on("failed", (job, err) =>
  console.log(`Job ${job?.id} failed: ${err.message}`)
);
