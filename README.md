# Next.js Error Reporter

[![npm version](https://img.shields.io/npm/v/next-error-reporter.svg)](https://www.npmjs.com/package/next-error-reporter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Universal error reporting solution for Next.js applications with features like queueing, batching, and environment-aware reporting.

## Features

- 🚨 Universal error handling (client & server)
- 📦 Error payload batching
- 🛡️ React Error Boundary integration
- 🔧 Configurable through environment variables

## Installation

```
npm install next-error-reporter
# or
yarn add next-error-reporter
```

## Configuration

```
NEXT_PUBLIC_ERROR_REPORTING_ENABLED=true
NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT=https://tasks.versionwatch.com/api/errors/report
NEXT_PUBLIC_ERROR_REPORTING_PROJECT_ID=your_project_id
NEXT_PUBLIC_ERROR_REPORTING_API_KEY=your_api_key
NEXT_PUBLIC_ERROR_BATCH_SIZE=20
NEXT_PUBLIC_ERROR_RATE_LIMIT=100
```

## Usage Examples

**Server-side** (API routes/middleware):

```
import { serverReporter } from 'next-error-reporter';

export async function handler(req, res) {
  try {
    // Your logic
  } catch (error) {
    serverReporter.report(error, {
      route: req.url,
      method: req.method
    });
    res.status(500).json({ error: 'Internal error' });
  }
}
```

**Client-side** :

```
import { clientReporter } from 'next-error-reporter';

export function unsafeFunction() {
  try {
    // Risky operation
  } catch (error) {
    clientReporter.report(error, {
      component: 'MyComponent',
      state: JSON.stringify(currentState)
    });
  }
}
```

**Global Error Handling** (in `_app.tsx`):

```
import { ErrorBoundary } from 'next-error-reporter';

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary fallback={<ErrorScreen />}>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
```

**License**
MIT © VersionWatch
-------------------

This complete package setup provides:

- Type-safe implementation
- Dual CJS/ESM module support
- Comprehensive documentation
- Proper type declarations
- Build pipeline configuration
- Environment variable support
- Example implementations

The package is ready to publish on npm and use in any Next.js project (version 12+) with both JavaScript and TypeScript support.
