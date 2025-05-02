import { getConfig } from './config';
import { ErrorPayload } from './types';

export const formatException = (error: Error, context?: Record<string, unknown>): ErrorPayload => {
  const { environment, projectId, apiKey } = getConfig();
  
  return {
    exception: error.name,
    message: error.message,
    stack_trace: error.stack || '',
    environment: {
      language: `Node.js ${process.version}`,
      framework: 'Next.js',
      environment,
    },
    context: {
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      ...context
    },
    project_id: projectId,
    api_key: apiKey,
    timestamp: new Date().toISOString()
  };
};