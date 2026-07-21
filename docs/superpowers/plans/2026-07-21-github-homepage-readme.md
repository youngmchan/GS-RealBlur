# GitHub Homepage README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a static project-page-equivalent README and point the webpage Code button at the published repository.

**Architecture:** `README.md` reuses existing project assets in static GitHub Markdown. `index.html` changes only the Code URL. The page-content test verifies the new README and repository URL.

**Tech Stack:** GitHub Markdown, static HTML, PowerShell tests.

---

### Task 1: Define the README contract

**Files:**

- Modify: `tests/page-content.test.ps1`

- [ ] **Step 1: Write failing assertions**

Add these assertions:

```powershell
$readmePath = Join-Path $PSScriptRoot '../README.md'
if (-not (Test-Path -LiteralPath $readmePath)) { throw 'Missing GitHub homepage README.' }
$readme = Get-Content -LiteralPath $readmePath -Raw
if ($readme -notmatch [regex]::Escape('Cross-dataset evaluation with NAFNet')) { throw 'README is missing the representative NAFNet table.' }
if ($readme -notmatch [regex]::Escape('assets/images/more-metric-visual.png')) { throw 'README is missing the representative qualitative comparison.' }
```

- [ ] **Step 2: Verify failure**

Run: `& .\tests\page-content.test.ps1`

Expected: `Missing GitHub homepage README.`

### Task 2: Add the static GitHub homepage

**Files:**

- Create: `README.md`
- Modify: `index.html:22`

- [ ] **Step 1: Create the Markdown page**

Use the page title, authors, affiliation, resource links, Abstract, acquisition comparison figure, Method Overview figure, NAFNet cross-dataset table, one corresponding qualitative figure, OOD summary, BPR table and figure, and a link to interactive Dataset Patch Samples.

- [ ] **Step 2: Update the Code URL**

Replace the Code button link with:

```html
href="https://github.com/youngmchan/GS-RealBlur"
```

- [ ] **Step 3: Verify targeted tests**

Run: `& .\tests\page-content.test.ps1`

Expected: exit code `0`.

### Task 3: Verify and publish

**Files:**

- Verify: `tests/minimal-layout.test.ps1`
- Verify: `tests/asset-bundle.test.ps1`
- Verify: `tests/results-carousel-loader.test.ps1`
- Verify: `tests/results-carousel.test.mjs`
- Verify: `tests/sample-comparison.test.mjs`

- [ ] **Step 1: Run the full suite**

Run the six existing page, layout, asset, sample, carousel, and loader tests.

Expected: every command exits with code `0`.

- [ ] **Step 2: Commit and publish**

```powershell
git add README.md index.html tests/page-content.test.ps1
git commit -m "docs: add project homepage README"
git push origin gh-pages
```

Expected: push output contains `gh-pages -> gh-pages`.
