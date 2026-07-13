import { fallbackGuidance, summarizeForGuidance, validateGuidance } from './game-core.js';

export async function requestGuidance(state, tier, endpoint = '') {
  const fallback = fallbackGuidance(state, tier);
  if (!endpoint) return { ...fallback, source: 'authored fallback' };
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier, state: summarizeForGuidance(state) }),
      signal: AbortSignal.timeout(4500)
    });
    if (!response.ok) return { ...fallback, source: 'authored fallback' };
    const guide = validateGuidance(await response.json(), state, tier);
    return guide ? { ...guide, source: 'AI guide' } : { ...fallback, source: 'authored fallback' };
  } catch {
    return { ...fallback, source: 'authored fallback' };
  }
}
