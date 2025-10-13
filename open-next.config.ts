// open-next.config.ts
import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'
import { withRegionalCache } from '@opennextjs/cloudflare/overrides/incremental-cache/regional-cache'
// ...

// With regional cache enabled:
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, {
    bypassTagCacheOnCacheHit: true,
    mode: 'long-lived',
  }),
})
