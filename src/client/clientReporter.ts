import { formatException } from '../utils/formatException';
import { getConfig } from '../config';
import { ErrorPayload } from '../types';

class ClientReporter {
  private queue: ErrorPayload[] = [];
  
  report(error: Error, context?: Record<string, unknown>) {
    const { enabled, ignoredErrors, queueEnabled } = getConfig();
    
    if (!enabled || this.shouldIgnore(error)) return;

    const payload = formatException(error, context);

    if (queueEnabled) {
      this.queue.push(payload);
      if (this.queue.length >= getConfig().batchSize) {
        this.flush();
      }
    } else {
      this.send([payload]);
    }
  }

  private shouldIgnore(error: Error): boolean {
    return getConfig().ignoredErrors.some(ignored =>
      typeof ignored === 'string' ? error.name === ignored : error instanceof ignored
    );
  }

  private flush() {
    if (this.queue.length === 0) return;
    
    const batch = this.queue.splice(0, getConfig().batchSize);
    this.send(batch);
  }

  private send(payloads: ErrorPayload[]) {
    const { endpoint, rateLimit } = getConfig();
    
    navigator.sendBeacon(endpoint, JSON.stringify({
      errors: payloads,
      count: payloads.length
    }));
  }
}

export const clientReporter = new ClientReporter();