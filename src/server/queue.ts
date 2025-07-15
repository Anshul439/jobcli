import { Queue } from 'bullmq';
import { JobData } from '../types/job';
import redis from './utils/redis';

const connection = redis;

export const getTargetQueue = (target: string) => {
  return new Queue<JobData>(`test-jobs-${target}`, { connection });
};
