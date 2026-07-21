import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const workflow = await readFile(new URL('../.github/workflows/quality-gates.yml', import.meta.url), 'utf8');

test('CQ-001, CQ-002, and CQ-003: branch and PR quality workflow is read-only and runs all declared checks', () => {
  assert.match(workflow, /^\s*pull_request:\s*$/m);
  assert.match(workflow, /^\s*push:\s*$/m);
  assert.match(workflow, /permissions:\s*\n\s*contents:\s*read/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npx playwright install --with-deps chromium/);
  for (const command of ['npm run check', 'npm test', 'npm run test:browser', 'npm run test:a11y', 'git diff --check']) {
    assert.match(workflow, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.doesNotMatch(workflow, /deploy-pages|upload-pages-artifact|pages:\s*write|id-token:\s*write/);
});
