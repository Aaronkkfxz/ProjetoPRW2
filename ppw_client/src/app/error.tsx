'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Ops! Algo quebrou na interface da Oficina.</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()} style={{ padding: '10px 20px', marginTop: '1rem', cursor: 'pointer' }}>
        Tentar recuperar
      </button>
    </div>
  );
}
