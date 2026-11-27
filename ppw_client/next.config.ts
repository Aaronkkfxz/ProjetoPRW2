import { withSentryConfig } from '@sentry/nextjs/config';

const nextConfig = {
  // as suas outras configs do Next.js
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: 'Oficina-projeto', // O nome que você deu lá no GlitchTip
  project: 'ppw_client',
});
