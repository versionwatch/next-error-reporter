import axios from 'axios';
import { formatException } from './utils/formatException';
import { getConfig } from './config';
import { ErrorPayload } from './types';

class ServerReporter {
  private queue: ErrorPayload[] = [];
  private isSending = false;

  async report(error: Error, context?: Record<string, unknown>) {
    const { enabled, ignoredErrors, queueEnabled } = getConfig();
    
    if (!enabled || this.shouldIgnore(error)) return;

    const payload = formatException(error, context);

    if (queueEnabled) {
      this.queue.push(payload);
      if (this.queue.length >= getConfig().batchSize) {
        await this.flush();
      }
    } else {
      await this.send([payload]);
    }
  }

  private shouldIgnore(error: Error): boolean {
    return getConfig().ignoredErrors.some(ignored =>
      typeof ignored === 'string' ? error.name === ignored : error instanceof ignored
    );
  }

  private async flush() {
    if (this.isSending || this.queue.length === 0) return;
    
    this.isSending = true;
    const batch = this.queue.splice(0, getConfig().batchSize);
    
    try {
      await this.send(batch);
    } finally {
      this.isSending = false;
    }
  }

  private async send(payloads: ErrorPayload[]) {
    const { endpoint, rateLimit } = getConfig();
    
    try {
      await axios.post(endpoint, {
        errors: payloads,
        count: payloads.length
      }, {
        timeout: 5000,
        headers: {
          'X-Error-Rate-Limit': rateLimit.toString()
        }
      });
    } catch (error) {
      console.error('Error reporting failed:', error);
    }
  }
}

export const serverReporter = new ServerReporter();