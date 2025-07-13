export interface SubmitOptions {
  orgId: string;
  appVersionId: string;
  test: string;
  target?: string;
}

export interface StatusOptions {
  jobId: string;
}