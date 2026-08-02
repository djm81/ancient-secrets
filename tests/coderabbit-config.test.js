import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const root = new URL('..', import.meta.url);
const config = await readFile(new URL('../.coderabbit.yaml', import.meta.url), 'utf8');

async function checkConfig(source) {
  const directory = await mkdtemp(join(tmpdir(), 'maestros-coderabbit-'));
  const configPath = join(directory, '.coderabbit.yaml');
  await writeFile(configPath, source);
  try {
    return await execFileAsync('ruby', ['scripts/check-coderabbit-config.rb'], {
      cwd: root,
      env: { ...process.env, CODERABBIT_CONFIG: configPath }
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test('CodeRabbit policy checker accepts the repository configuration', async () => {
  const result = await checkConfig(config);
  assert.match(result.stdout, /CodeRabbit review-policy contract valid/);
});

test('CodeRabbit policy checker rejects disabled reviews and altered path guidance', async () => {
  await assert.rejects(
    checkConfig(config.replace('enabled: true', 'enabled: false')),
    /automatic review disabled/
  );
  await assert.rejects(
    checkConfig(config.replace('Treat cache changes as release compatibility work.', 'Obsolete cache guidance.')),
    /missing required instruction text for service-worker\.js/
  );
});
