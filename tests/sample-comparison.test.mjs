import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../assets/js/sample-comparison.js', import.meta.url), 'utf8');
const context = { globalThis: {} };
vm.createContext(context);
vm.runInContext(source, context);

assert.equal(typeof context.globalThis.SampleComparison.setDividerPosition, 'function');
assert.equal(context.globalThis.SampleComparison.setDividerPosition(-20), 0);
assert.equal(context.globalThis.SampleComparison.setDividerPosition(50), 50);
assert.equal(context.globalThis.SampleComparison.setDividerPosition(120), 100);
