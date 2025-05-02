interface Config {
    enabled: boolean;
    endpoint: string;
    projectId?: string;
    apiKey?: string;
    ignoredErrors: (Error | string)[];
    queueEnabled: boolean;
    batchSize: number;
    rateLimit: number;
    environment: 'development' | 'production';
  }
  
  const defaults: Config = {
    enabled: process.env.NEXT_PUBLIC_ERROR_REPORTING_ENABLED === 'true',
    endpoint: process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT || 'https://tasks.versionwatch.com/api/errors/report',
    projectId: process.env.NEXT_PUBLIC_ERROR_REPORTING_PROJECT_ID,
    apiKey: process.env.NEXT_PUBLIC_ERROR_REPORTING_API_KEY,
    ignoredErrors: [],
    queueEnabled: process.env.NEXT_PUBLIC_ERROR_QUEUE_ENABLED === 'true',
    batchSize: parseInt(process.env.NEXT_PUBLIC_ERROR_BATCH_SIZE || '20'),
    rateLimit: parseInt(process.env.NEXT_PUBLIC_ERROR_RATE_LIMIT || '100'),
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'development'
  };
  
  let config: Config = { ...defaults };
  
  export const configure = (customConfig: Partial<Config>) => {
    config = { ...config, ...customConfig };
  };
  
  export const getConfig = () => config;