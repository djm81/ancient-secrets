import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const workflow = await readFile(new URL('../.github/workflows/quality-gates.yml', import.meta.url), 'utf8');
const workflowTriggers = workflow.match(/^on:\n(?<triggers>(?: {2}[^\n]*\n)+)/m)?.groups?.triggers;
const submittedDiffBaseStep = workflow.match(/ {6}- name: Determine submitted diff base\n(?<script>(?: {8,}.*\n)+?)(?= {6}- name: Run quality gates)/)?.groups?.script;

test('CQ-001, CQ-002, and CQ-003: branch and PR quality workflow is read-only and runs all declared checks', () => {
  assert.match(workflow, /^\s*pull_request:\s*$/m);
  assert.match(workflow, /^\s*push:\s*$/m);
  assert.match(workflow, /permissions:\s*\n\s*contents:\s*read/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npx playwright install --with-deps chromium/);
  assert.match(workflow, /fetch-depth:\s*0/);
  assert.ok(workflowTriggers, 'workflow must declare an on trigger block');
  assert.match(workflowTriggers, /^  workflow_dispatch:\s*$/m);
  assert.ok(submittedDiffBaseStep, 'workflow must define the submitted-diff-base step');
  assert.match(submittedDiffBaseStep, /elif \[\[ "\$\{\{ github\.event_name \}\}" == "workflow_dispatch" \|\| "\$\{\{ github\.event\.before \}\}" =~ \^0\+\$ \]\]; then\n\s+echo "base=\$\(git rev-parse "\$\{\{ github\.sha \}\}\^"\)/);
  assert.match(workflow, /git diff --check\s+"\$\{\{ steps\.whitespace-base\.outputs\.base \}\}"\s+"\$\{\{ github\.sha \}\}"/);
  for (const command of ['npm run check', 'npm test', 'npm run test:browser', 'npm run test:a11y', 'git diff --check']) {
    assert.match(workflow, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.doesNotMatch(workflow, /deploy-pages|upload-pages-artifact|pages:\s*write|id-token:\s*write/);
});
