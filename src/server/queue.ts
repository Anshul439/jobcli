import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { JobData } from '../types/job';

const connection = new IORedis();

export const jobQueue = new Queue<JobData>('test-jobs', { connection });
