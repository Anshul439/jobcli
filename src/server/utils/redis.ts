import IORedis from 'ioredis';

const redis = new IORedis({
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export default redis;
