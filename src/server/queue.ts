import { Queue } from 'bullmq';
import { JobData } from '../types/job';
import redis from './utils/redis';

const connection = redis;

export const jobQueue = new Queue<JobData>('test-jobs', { connection });
