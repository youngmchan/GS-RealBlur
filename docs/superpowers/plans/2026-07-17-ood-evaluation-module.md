# OOD Evaluation Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the OOD table and OOD visual comparison into their own experiment module.

**Architecture:** The HTML adds an OOD card after cross-dataset results. JavaScript keeps only model-table data in the original carousel, exports the OOD data independently, mounts a fixed OOD table, and removes the OOD image from the qualitative carousel.

**Tech Stack:** Static HTML, vanilla JavaScript, PowerShell and Node.js tests.

---

### Task 1: Define and verify the new OOD boundary

**Files:**

- Modify: `tests/page-content.test.ps1`
- Modify: `tests/results-carousel.test.mjs`

- [ ] **Step 1: Write failing HTML assertions**

Add the following to `tests/page-content.test.ps1`:

```powershell
if ($html -notmatch 'id="ood-results"') { throw 'Missing standalone OOD evaluation mount.' }
if ($html -notmatch 'id="ood-title">Out-of-Distribution Evaluation') { throw 'Missing standalone OOD evaluation heading.' }
```

- [ ] **Step 2: Verify the test fails**

Run: `& .\tests\page-content.test.ps1`

Expected: failure containing `Missing standalone OOD evaluation mount.`

- [ ] **Step 3: Write failing carousel-data assertions**

Add the following to `tests/results-carousel.test.mjs` after loading `ResultsCarousel`:

```javascript
const crossSlides = ResultsCarousel.slides.filter((slide) => slide.type === 'cross');
assert.equal(crossSlides.length, 3);
assert.equal(ResultsCarousel.oodSlide.type, 'ood');
```

- [ ] **Step 4: Verify the test fails**

Run: `& 'C:\Users\11027\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\results-carousel.test.mjs`

Expected: failure because `oodSlide` is not exported.

- [ ] **Step 5: Commit the test contract**

```powershell
git add tests/page-content.test.ps1 tests/results-carousel.test.mjs
git commit -m "test: define standalone OOD evaluation module"
```

### Task 2: Implement the standalone OOD card

**Files:**

- Modify: `index.html:64-75`
- Modify: `assets/js/results-carousel.js:4-95`

- [ ] **Step 1: Add the standalone HTML card**

Insert this directly after `#results-carousel`:

```html
<article class="paper-card experiment-card ood-card" aria-labelledby="ood-title">
  <h3 id="ood-title">Out-of-Distribution Evaluation</h3>
  <p>On RWBI and DVD-Test, GS-RealBlur achieves the highest scores across all six reported no-reference metrics, demonstrating robust perceptual quality beyond the training-domain benchmarks.</p>
  <div id="ood-results"></div>
  <figure>
    <img src="assets/images/nr-metric.png" alt="OOD visual comparison across real-world in-the-wild scenes">
    <figcaption>OOD visual comparison on RWBI and DVD-Test.</figcaption>
  </figure>
</article>
```

- [ ] **Step 2: Extract OOD data from `slides`**

Move the existing object with `type: 'ood'` from `slides` into `const oodSlide`. Export it with:

```javascript
globalThis.ResultsCarousel = { slides, oodSlide, advanceIndex, crossRankClass, rankValues };
```

- [ ] **Step 3: Mount the fixed OOD table**

Add and invoke this function:

```javascript
function initializeOodResults() {
  const mount = document.querySelector('#ood-results');
  if (!mount) return;
  mount.innerHTML = `<h4>${oodSlide.title}</h4>${oodHtml(oodSlide)}`;
}
```

Invoke it between `initializeCarousel()` and `initializeQualitativeCarousel()`.

- [ ] **Step 4: Keep only non-OOD visuals in the qualitative carousel**

Change its `images` list to `metric.png` and `more-metric-visual.png`; remove `nr-metric.png`.

- [ ] **Step 5: Verify targeted tests pass**

Run:

```powershell
& .\tests\page-content.test.ps1
& 'C:\Users\11027\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\results-carousel.test.mjs
```

Expected: both commands exit with code `0`.

- [ ] **Step 6: Commit the feature**

```powershell
git add index.html assets/js/results-carousel.js
git commit -m "feat: separate OOD evaluation module"
```

### Task 3: Run all regressions and publish

**Files:**

- Verify: `tests/asset-bundle.test.ps1`
- Verify: `tests/minimal-layout.test.ps1`
- Verify: `tests/results-carousel-loader.test.ps1`
- Verify: `tests/sample-comparison.test.mjs`

- [ ] **Step 1: Run the complete suite**

```powershell
& .\tests\page-content.test.ps1
& .\tests\minimal-layout.test.ps1
& .\tests\asset-bundle.test.ps1
& 'C:\Users\11027\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\sample-comparison.test.mjs
& 'C:\Users\11027\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\results-carousel.test.mjs
& .\tests\results-carousel-loader.test.ps1
```

Expected: every command exits with code `0`.

- [ ] **Step 2: Verify and publish the branch**

```powershell
git status --short --branch
git push origin gh-pages
```

Expected: a clean tracking branch followed by `gh-pages -> gh-pages`.
