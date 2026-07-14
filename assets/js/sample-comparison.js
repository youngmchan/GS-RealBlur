(function () {
  function setDividerPosition(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return 50;
    return Math.max(0, Math.min(100, numericValue));
  }

  function createComparison(sample) {
    const blurSource = sample.dataset.blurSrc;
    const gtSource = sample.dataset.gtSrc;
    const name = sample.dataset.sampleName || 'Dataset sample';
    sample.innerHTML = `<div class="sample-viewport"><img class="sample-image" src="${blurSource}" alt="${name}: blurry image"><div class="sample-gt-layer"><img src="${gtSource}" alt="${name}: ground-truth image"></div><span class="sample-label blur">Blur</span><span class="sample-label gt">GT</span><span class="sample-divider" aria-hidden="true"></span><input class="sample-slider" type="range" min="0" max="100" value="50" aria-label="Drag to compare Blur and GT for ${name}"></div><p class="sample-name">${name}</p>`;
    const viewport = sample.querySelector('.sample-viewport');
    const slider = sample.querySelector('.sample-slider');
    const update = () => {
      const position = setDividerPosition(slider.value);
      viewport.style.setProperty('--comparison-position', `${position}%`);
    };
    slider.addEventListener('input', update);
    update();
  }

  function initializeSampleComparisons() {
    document.querySelectorAll('.sample-comparison').forEach(createComparison);
  }

  if (typeof globalThis !== 'undefined') {
    globalThis.SampleComparison = { setDividerPosition };
  }
  if (typeof document !== 'undefined') initializeSampleComparisons();
}());
