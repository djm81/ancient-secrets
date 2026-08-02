import { parseSave } from './game-core.js?rev=v15';

export function exportChronicle(value) {
  const chronicle = parseSave(value);
  if (!chronicle) throw new Error('Only a valid chronicle can be exported.');
  return {
    name: 'maestros-secret-chronicle.json',
    type: 'application/json',
    text: `${JSON.stringify(chronicle, null, 2)}\n`
  };
}

export function importChronicle(raw) {
  return parseSave(raw);
}
