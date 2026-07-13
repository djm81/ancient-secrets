/**
 * Cloudflare Worker for The Maestro's Guidance.
 * Configure OPENAI_API_KEY and optionally OPENAI_MODEL / ALLOWED_ORIGIN with `wrangler secret put`.
 * Pair public deployments with a Cloudflare WAF rate-limit rule (for example, POST /api/maestro-guide).
 */
const ACTIONS = {
  'take-mirror': 'Take the hand mirror from the workshop wall.',
  'read-note': 'Use the hand mirror on the backwards-written note.',
  'find-brass-key': 'Search the workshop paint pots for the brass key.',
  'take-bread': 'Visit the piazza and accept the baker’s loaf.',
  'recover-gear': 'Use the loaf where the Maestro’s note directs you in the piazza.',
  'repair-machine': 'Fit the bronze gear into the flying machine.',
  'open-chest': 'Take the brass key to the iron-bound chest in the Scriptorium.',
  'take-lens': 'Take the crystal lens from the opened chest.',
  'find-cipher': 'Use the crystal lens at the Maestro’s chosen clue location.',
  'open-strongbox': 'Set the strongbox dials to the Roman-numeral clue.',
  'open-trapdoor': 'Use the ornate key on the trapdoor beneath the moved rug.'
};
const TIERS = new Set(['nudge', 'hint', 'reveal']);
const SCENES = new Set(['workshop', 'piazza', 'library', 'duomoentry', 'duomogallery', 'cellar']);
const ITEMS = new Set(['mirror', 'brasskey', 'bread', 'gear', 'lens', 'ornatekey']);
const MILESTONES = new Set(['mirrorTaken', 'noteRead', 'keyTaken', 'breadTaken', 'gearTaken', 'gearInstalled', 'chestOpen', 'lensTaken', 'cipherSeen', 'boxOpen', 'ornateTaken']);
function json(value, status = 200, origin) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', Vary: 'Origin' };
  if (origin) headers['Access-Control-Allow-Origin'] = origin;
  return new Response(JSON.stringify(value), { status, headers });
}
function actionFor(milestones = {}) {
  if (!milestones.mirrorTaken) return 'take-mirror';
  if (!milestones.noteRead) return 'read-note';
  if (!milestones.keyTaken) return 'find-brass-key';
  if (!milestones.breadTaken) return 'take-bread';
  if (!milestones.gearTaken) return 'recover-gear';
  if (!milestones.gearInstalled) return 'repair-machine';
  if (!milestones.chestOpen) return 'open-chest';
  if (!milestones.lensTaken) return 'take-lens';
  if (!milestones.cipherSeen) return 'find-cipher';
  if (!milestones.boxOpen || !milestones.ornateTaken) return 'open-strongbox';
  return 'open-trapdoor';
}
function fallback(tier, action) {
  const message = tier === 'reveal' ? ACTIONS[action] : tier === 'hint'
    ? `Your next useful move concerns this: ${ACTIONS[action]}`
    : 'Examine the tools you carry and the objects that can read, open, feed, or repair.';
  return { tier, message, nextActionId: action };
}
function isValidRequest(body) {
  const hasOnlyBodyKeys = body && Object.keys(body).every(key => ['tier', 'state'].includes(key));
  const hasOnlyStateKeys = body?.state && Object.keys(body.state).every(key => ['scene', 'inventory', 'milestones', 'nextActionId'].includes(key));
  const hasOnlyMilestones = body?.state?.milestones && Object.keys(body.state.milestones).every(key => MILESTONES.has(key));
  return hasOnlyBodyKeys && hasOnlyStateKeys && hasOnlyMilestones && TIERS.has(body.tier) && body.state && typeof body.state === 'object'
    && body.state.nextActionId === actionFor(body.state.milestones)
    && SCENES.has(body.state.scene)
    && Array.isArray(body.state.inventory) && body.state.inventory.length <= 6
    && body.state.inventory.every(item => ITEMS.has(item))
    && new Set(body.state.inventory).size === body.state.inventory.length
    && body.state.milestones && typeof body.state.milestones === 'object'
    && Object.values(body.state.milestones).every(value => typeof value === 'boolean');
}
function validModelReply(value, tier, action) {
  if (!value || value.tier !== tier || value.nextActionId !== action || typeof value.message !== 'string') return null;
  const message = value.message.trim().replace(/\s+/g, ' ');
  return message && message.split(' ').length <= 45 ? { tier, message, nextActionId: action } : null;
}

export default {
  async fetch(request, env) {
    const configuredOrigin = env.ALLOWED_ORIGIN;
    const requestOrigin = request.headers.get('Origin');
    const origin = configuredOrigin && requestOrigin === configuredOrigin ? configuredOrigin : undefined;
    const aiEnabled = Boolean(env.OPENAI_API_KEY);
    if (request.method === 'OPTIONS') {
      if (!configuredOrigin || requestOrigin !== configuredOrigin) return new Response(null, { status: 403 });
      return new Response(null, { headers: { 'Access-Control-Allow-Origin': configuredOrigin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' } });
    }
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, origin);
    if (aiEnabled && (!configuredOrigin || !env.MAESTRO_RATE_LIMIT)) return json({ error: 'Guide deployment is not safely configured' }, 503, origin);
    if (aiEnabled && requestOrigin !== configuredOrigin) return json({ error: 'Origin not allowed' }, 403);
    let rawBody;
    try { rawBody = await request.text(); } catch { return json({ error: 'Invalid request body' }, 400, origin); }
    if (new TextEncoder().encode(rawBody).byteLength > 4096) return json({ error: 'Payload too large' }, 413, origin);
    let body;
    try { body = JSON.parse(rawBody); } catch { return json({ error: 'Invalid JSON' }, 400, origin); }
    if (!isValidRequest(body)) return json({ error: 'Invalid guidance request' }, 400, origin);
    if (env.MAESTRO_RATE_LIMIT) {
      try {
        const ip = request.headers.get('CF-Connecting-IP') || 'anonymous';
        const { success } = await env.MAESTRO_RATE_LIMIT.limit({ key: ip });
        if (!success) return json({ error: 'Please wait before requesting another hint.' }, 429, origin);
      } catch {
        return json({ error: 'Guide rate limit is unavailable' }, 503, origin);
      }
    }
    const action = body.state.nextActionId;
    if (!aiEnabled) return json(fallback(body.tier, action), 200, origin);

    const schema = { type: 'object', additionalProperties: false, required: ['tier', 'message', 'nextActionId'], properties: {
      tier: { type: 'string', enum: [body.tier] },
      message: { type: 'string', maxLength: 280 },
      nextActionId: { type: 'string', enum: [action] }
    } };
    const prompt = `You are the bounded guide for a Renaissance point-and-click game. Return only JSON matching the schema. Do not invent game facts, names, puzzles, or actions. Give a ${body.tier} hint in 45 words or fewer. The only permitted next action is: ${ACTIONS[action]}. State: ${JSON.stringify(body.state)}.`;
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: env.OPENAI_MODEL || 'gpt-5-mini', messages: [{ role: 'system', content: 'You are a careful game hint writer.' }, { role: 'user', content: prompt }], response_format: { type: 'json_schema', json_schema: { name: 'maestro_guidance', strict: true, schema } }, max_completion_tokens: 180 })
      });
      if (!response.ok) return json(fallback(body.tier, action), 200, origin);
      const output = await response.json();
      const parsed = JSON.parse(output?.choices?.[0]?.message?.content || '{}');
      return json(validModelReply(parsed, body.tier, action) || fallback(body.tier, action), 200, origin);
    } catch {
      return json(fallback(body.tier, action), 200, origin);
    }
  }
};
