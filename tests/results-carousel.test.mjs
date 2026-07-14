import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../assets/js/results-carousel.js', import.meta.url), 'utf8');
const context = { globalThis: {}, document: undefined };
vm.runInNewContext(source, context);
const { advanceIndex, crossRankClass, rankValues, slides } = context.globalThis.ResultsCarousel;

assert.equal(slides.length, 4);
assert.equal(advanceIndex(3, 1, 4), 0);
assert.equal(advanceIndex(0, -1, 4), 3);
assert.deepEqual(rankValues([28.89, 27.16, 27.23], 'higher'), ['rank-best', '', 'rank-second']);
assert.deepEqual(rankValues([0.151, 0.228, 0.180], 'lower'), ['rank-best', '', 'rank-second']);
assert.equal(slides[0].rows.length, 6);
assert.notDeepEqual(slides[0].rows[3][1], slides[0].rows[4][1]);
assert.equal(crossRankClass(36.10, 3, 0, 'higher'), 'rank-best');
assert.equal(crossRankClass(33.87, 3, 0, 'higher'), 'rank-second');
assert.equal(slides[0].rows.length, 6);
assert.deepEqual(Array.from(rankValues(slides[0].rows.map((row) => row[1][0][0]), 'higher')).slice(0, 2), ['rank-best', '']);
