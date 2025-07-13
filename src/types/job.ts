export interface JobData {
  org_id: string;
  app_version_id: string;
  test_path: string;
  target: string;
  priority?: number;
}

export interface JobSummary {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}

export interface QueuedJob {
  id: string;
  org_id: string;
  test_path: string;
  target: string;
  priority: number;
  state: string;
  attemptsMade: number;
  timestamp: number;
}