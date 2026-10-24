// Regression check: dsh >= 0.2.1 no longer registers {{cwd}} as a prompt
// variable, so overlayOfficialIdentity() must never emit an unresolved one.
import { overlayOfficialIdentity } from '../lib/identity.js';

const cases = [
  [{ name: 'deployment:persona-suffix', text: '', order: 10200 }],
  [{ name: 'deployment:persona-suffix', text: 'Your working directory is {{cwd}}.', order: 10200 }],
  [{ name: 'deployment:persona-suffix', text: 'Working directory: {{cwd}}.', order: 10200 }],
  [{ name: 'deployment:persona-suffix', text: 'The current working directory is provided in the runtime context.', order: 10200 }],
  [],
];

let failed = false;
for (const sections of cases) {
  const out = overlayOfficialIdentity(sections);
  const unresolved = out.filter((section) => /\{\{/.test(String(section?.text || '')));
  if (unresolved.length > 0) {
    failed = true;
    console.error('UNRESOLVED', JSON.stringify(sections), '=>', JSON.stringify(out));
  }
}

if (failed) process.exit(1);
console.log('prompt variable check: OK');
