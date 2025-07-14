import { Worker } from "bullmq";
import redis from "./utils/redis";

const connection = redis;

const AGENT_TARGET = process.env.AGENT_TARGET;
console.log(AGENT_TARGET);

if (
  !AGENT_TARGET ||
  !["emulator", "device", "browserstack"].includes(AGENT_TARGET)
) {
  console.error("AGENT_TARGET must be one of: emulator, device, browserstack");
  process.exit(1);
}

console.log(`Starting worker for target: ${AGENT_TARGET}`);

const registerTarget = async () => {
  await redis.sadd("active_targets", AGENT_TARGET);
  console.log(`Registered "${AGENT_TARGET}" in active_targets`);
};

const deregisterTarget = async () => {
  await redis.srem("active_targets", AGENT_TARGET);
  console.log(`Deregistered "${AGENT_TARGET}" from active_targets`);
};

// Register the worker
(async () => {
  await registerTarget();
})();

const gracefulShutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}, shutting down worker...`);
  await worker.close();
  await deregisterTarget();
  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGQUIT", () => gracefulShutdown("SIGQUIT"));

const worker = new Worker(
  "test-jobs",
  async (job) => {
    if (job.data.target !== AGENT_TARGET) {
      console.log(
        `Skipping job ${job.id} — target ${job.data.target} ≠ ${AGENT_TARGET}`
      );
      throw new Error("Target mismatch");
    }

    const { org_id, app_version_id, test_path, target } = job.data;

    const isInstalled = await redis.sismember(
      "installed_versions",
      app_version_id
    );
    if (!isInstalled) {
      console.log(`[${AGENT_TARGET}] Installing ${app_version_id}`);
      await new Promise((r) => setTimeout(r, 1000));
      await redis.sadd("installed_versions", app_version_id);
    }

    console.log(`[${AGENT_TARGET}] Running ${test_path}`);
    await new Promise((res) => setTimeout(res, 5000));
  },
  {
    connection,
    concurrency: 1,
  }
);

worker.on("completed", async (job) => {
  const { org_id, app_version_id, test_path, target } = job.data;
  const lockKey = `joblock:${org_id}:${app_version_id}:${test_path}:${target}`;
  await redis.del(lockKey);

  console.log(`[${AGENT_TARGET}] Job ${job.id} completed`);
});

worker.on("failed", async (job, err) => {
  console.log(`[${AGENT_TARGET}] Job ${job?.id} failed: ${err.message}`);
});
