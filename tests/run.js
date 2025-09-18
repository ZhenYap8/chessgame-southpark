// Simple zero-dependency test runner (ESM)
// Usage: node tests/run.js
import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const tests = [];
export function test(name, fn){ tests.push({ name, fn }); }
export function expect(received){
  return {
    toBe(expected){ if(received !== expected) throw new Error(`Expected ${received} to be ${expected}`); },
    toEqual(expected){ const r = JSON.stringify(received); const e = JSON.stringify(expected); if(r!==e) throw new Error(`Expected ${r} to equal ${e}`); },
    toBeTruthy(){ if(!received) throw new Error(`Expected value to be truthy`); },
    toBeFalsy(){ if(received) throw new Error(`Expected value to be falsy`); }
  };
}

async function loadTests(dir){
  const entries = fs.readdirSync(dir, { withFileTypes:true });
  for(const ent of entries){
    const full = path.join(dir, ent.name);
    if(ent.isDirectory()) await loadTests(full);
    else if(ent.name.endsWith('.test.js')) await import(url.pathToFileURL(full));
  }
}

const started = Date.now();
await loadTests(path.join(__dirname, 'unit'));
let pass=0, fail=0; const failures=[];
for(const t of tests){
  try { await t.fn(); pass++; }
  catch(e){ fail++; failures.push({ name:t.name, error:e }); }
}
const dur = Date.now()-started;
console.log(`\nTest Results: ${pass} passed, ${fail} failed in ${dur}ms`);
if(failures.length){
  for(const f of failures){
    console.error(`\nFAIL: ${f.name}`);
    console.error(f.error.stack||f.error.message||f.error);
  }
  process.exitCode = 1;
} else {
  console.log('All tests passed.');
}
