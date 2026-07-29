export function initialEraPackState(pack) {
  return { id: pack.id, status: 'available-online', bytes: pack.bytes };
}

export function evaluateEraPackDownload(pack, estimate, consented) {
  if (!consented) return { status: 'needs-consent', pack };
  if (!estimate || !Number.isFinite(estimate.quota) || !Number.isFinite(estimate.usage)) return { status: 'storage-unknown', pack };
  return estimate.quota - estimate.usage >= pack.bytes
    ? { status: 'ready', pack }
    : { status: 'insufficient-storage', pack };
}

export function transitionEraPackState(state, event) {
  const allowed = {
    'available-online': { request: 'checking-storage', failed: 'failed' },
    'checking-storage': { ready: 'downloading', failed: 'failed' },
    downloading: { complete: 'available-offline', failed: 'failed' },
    'available-offline': { evicted: 'available-online' },
    failed: { retry: 'checking-storage' }
  };
  const next = allowed[state.status]?.[event];
  return next ? { ...state, status: next } : state;
}
