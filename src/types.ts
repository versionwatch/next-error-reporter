export interface ErrorPayload {
    exception: string;
    message: string;
    stack_trace: string;
    environment: {
      language: string;
      framework: string;
      environment: 'development' | 'production';
    };
    context: Record<string, unknown>;
    project_id?: string;
    api_key?: string;
    timestamp: string;
  }