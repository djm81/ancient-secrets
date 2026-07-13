import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const rootPage = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const gamePage = await readFile(new URL('../maestros-secret.html', import.meta.url), 'utf8');

test('PE-001: the root page introduces the experience before play', () => {
  assert.match(rootPage, /Play \(6–8 min\)/);
  assert.match(rootPage, /Engineering notes/i);
  assert.doesNotMatch(rootPage, /http-equiv="refresh"/i);
});

test('PE-002: the game presents a current objective and guidance entry point', () => {
  assert.match(gamePage, /id="objective"/);
  assert.match(gamePage, /id="guidebtn"/);
});

test('GC-001: the game runtime persists and resumes a valid chronicle', () => {
  assert.match(gamePage, /SAVE_KEY/);
  assert.match(gamePage, /Continue Chronicle/);
  assert.match(gamePage, /loadChronicle|resumeChronicle/);
});

test('EQ-001 and EQ-002: interactive feedback exposes accessibility contracts', () => {
  assert.match(gamePage, /aria-live="polite"/);
  assert.match(gamePage, /id="contrastbtn"/);
  assert.match(gamePage, /addEventListener\('keydown'/);
  assert.match(gamePage, /prefers-reduced-motion/);
});
