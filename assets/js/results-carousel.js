const crossColumns = ['RealBlur', 'RBVD', 'RSBlur', 'BSD', 'Average'];
const crossDirections = ['higher', 'higher', 'lower'];
const t = (psnr, ssim, lpips) => [psnr, ssim, lpips];

const slides = [
  {
    type: 'cross',
    title: 'NAFNet',
    caption: 'Cross-dataset evaluation with NAFNet. Each cell is PSNR / SSIM / LPIPS.',
    rows: [
      ['RealBlur', [t(28.89, .907, .151), t(26.00, .892, .249), t(30.61, .824, .342), t(30.00, .914, .125), t(28.88, .884, .221)]],
      ['RBVD', [t(27.16, .863, .228), t(26.51, .907, .231), t(29.59, .793, .388), t(29.36, .907, .136), t(28.16, .867, .246)]],
      ['RSBlur', [t(27.23, .871, .180), t(26.36, .905, .234), t(33.72, .877, .310), t(30.78, .923, .119), t(29.54, .894, .211)]],
      ['BSD', [t(26.88, .864, .217), t(26.36, .902, .248), t(30.93, .832, .377), t(33.87, .952, .078), t(29.53, .888, .230)]],
      ['GS-Blur', [t(27.33, .879, .147), t(26.26, .904, .201), t(32.87, .860, .317), t(31.37, .934, .109), t(29.46, .895, .192)]],
      ['GS-RealBlur', [t(27.67, .886, .140), t(26.71, .910, .186), t(33.15, .863, .311), t(31.92, .939, .093), t(29.86, .900, .183)]]
    ]
  },
  {
    type: 'cross',
    title: 'Restormer',
    caption: 'Cross-dataset evaluation with Restormer. Each cell is PSNR / SSIM / LPIPS.',
    rows: [
      ['RealBlur', [t(29.27, .878, .257), t(26.08, .821, .313), t(29.85, .778, .429), t(30.31, .903, .211), t(28.88, .845, .303)]],
      ['RBVD', [t(26.93, .814, .333), t(26.66, .835, .289), t(29.08, .747, .417), t(29.17, .892, .220), t(27.96, .822, .315)]],
      ['RSBlur', [t(27.30, .829, .297), t(26.50, .834, .296), t(33.42, .833, .381), t(30.81, .910, .211), t(29.51, .852, .296)]],
      ['BSD', [t(27.01, .823, .316), t(26.44, .825, .318), t(31.19, .792, .421), t(33.68, .943, .167), t(29.58, .846, .306)]],
      ['GS-Blur', [t(27.32, .841, .276), t(26.52, .833, .293), t(32.42, .817, .403), t(31.26, .920, .205), t(29.38, .853, .294)]],
      ['GS-RealBlur', [t(27.65, .852, .271), t(26.85, .838, .280), t(32.59, .820, .400), t(31.63, .925, .203), t(29.68, .859, .288)]]
    ]
  },
  {
    type: 'cross',
    title: 'EVSSM',
    caption: 'Cross-dataset evaluation with EVSSM. Each cell is PSNR / SSIM / LPIPS.',
    rows: [
      ['RealBlur', [t(29.59, .918, .239), t(25.90, .892, .301), t(30.23, .829, .440), t(30.13, .914, .227), t(28.96, .888, .302)]],
      ['RBVD', [t(26.98, .871, .329), t(26.62, .909, .283), t(29.71, .814, .442), t(28.73, .893, .236), t(28.01, .872, .323)]],
      ['RSBlur', [t(27.44, .876, .287), t(26.42, .904, .300), t(34.02, .875, .354), t(31.47, .934, .204), t(29.84, .897, .286)]],
      ['BSD', [t(25.87, .847, .328), t(26.36, .900, .284), t(30.32, .829, .425), t(36.10, .964, .138), t(29.66, .885, .294)]],
      ['GS-Blur', [t(27.37, .880, .250), t(26.44, .905, .290), t(33.28, .864, .383), t(31.80, .938, .196), t(29.72, .897, .280)]],
      ['GS-RealBlur', [t(27.82, .887, .243), t(26.96, .911, .277), t(33.48, .866, .380), t(32.17, .942, .193), t(30.11, .902, .273)]]
    ]
  }
];

const oodSlide = {
  type: 'ood',
  title: 'OOD No-Reference Evaluation',
  caption: 'In-the-wild evaluation. Higher is better for all reported metrics.',
  columns: ['RWBI MUSIQ', 'RWBI MANIQA', 'RWBI CLIP-IQA', 'DVD-Test MUSIQ', 'DVD-Test MANIQA', 'DVD-Test CLIP-IQA'],
  rows: [
    ['RealBlur', [58.552, .266, .341, 45.040, .231, .290]],
    ['RBVD', [52.014, .258, .313, 40.970, .206, .224]],
    ['RSBlur', [57.929, .264, .335, 41.132, .217, .274]],
    ['BSD', [58.104, .273, .336, 40.595, .214, .275]],
    ['GS-Blur', [61.330, .295, .367, 45.371, .235, .284]],
    ['GS-RealBlur', [61.610, .300, .372, 46.604, .242, .294]]
  ]
};

function advanceIndex(index, delta, count) {
  return (index + delta + count) % count;
}

function rankValues(values, direction) {
  const unique = [...new Set(values)].sort((a, b) => direction === 'lower' ? a - b : b - a);
  return values.map((value) => value === unique[0] ? 'rank-best' : value === unique[1] ? 'rank-second' : '');
}

function crossRankClass(value, column, metric, direction) {
  const values = slides.filter((slide) => slide.type === 'cross').flatMap((slide) =>
    slide.rows.map((row) => row[1][column][metric])
  );
  const unique = [...new Set(values)].sort((a, b) => direction === 'lower' ? a - b : b - a);
  return value === unique[0] ? 'rank-best' : value === unique[1] ? 'rank-second' : '';
}

const formatMetric = (value, metric) => metric === 0 ? value.toFixed(2) : value.toFixed(3);
const metricHtml = (values, classes) => values.map((value, index) => `<span class="${classes[index]}">${formatMetric(value, index)}</span>`).join(' / ');

function crossHtml(slide) {
  const columnRanks = crossColumns.map((_, columnIndex) => crossDirections.map((direction, metricIndex) =>
    rankValues(slide.rows.map((row) => row[1][columnIndex][metricIndex]), direction)
  ));
  const rows = slide.rows.map(([label, cells], rowIndex) => `<tr><th scope="row">${label}</th>${cells.map((cell, columnIndex) => {
    const classes = crossDirections.map((_, metricIndex) => columnRanks[columnIndex][metricIndex][rowIndex]);
    return `<td>${metricHtml(cell, classes)}</td>`;
  }).join('')}</tr>`).join('');
  return `<div class="table-wrap"><table class="results-table carousel-table"><caption>${slide.caption}</caption><thead><tr><th scope="col" class="split-header"><span class="test-label">Test Sets</span><span class="train-label">Training Sets</span></th>${crossColumns.map((column) => `<th scope="col">${column}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function oodHtml(slide) {
  const ranks = slide.columns.map((_, columnIndex) => rankValues(slide.rows.map((row) => row[1][columnIndex]), 'higher'));
  const rows = slide.rows.map(([label, values], rowIndex) => `<tr><th scope="row">${label}</th>${values.map((value, columnIndex) => `<td><span class="${ranks[columnIndex][rowIndex]}">${value.toFixed(3)}</span></td>`).join('')}</tr>`).join('');
  return `<div class="table-wrap"><table class="results-table carousel-table"><caption>${slide.caption}</caption><thead><tr><th scope="col">Training Set</th>${slide.columns.map((column) => `<th scope="col">${column}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function initializeCarousel() {
  const mount = document.querySelector('#results-carousel');
  if (!mount) return;

  let index = 0;
  mount.innerHTML = '<div class="carousel-stage" tabindex="0" aria-label="Experiment result tables"><button class="carousel-control previous" type="button" aria-label="Show previous result table">&#8249;</button><div class="carousel-surface" aria-live="polite"></div><button class="carousel-control next" type="button" aria-label="Show next result table">&#8250;</button></div>';
  const stage = mount.querySelector('.carousel-stage');
  const surface = mount.querySelector('.carousel-surface');

  const render = () => {
    const slide = slides[index];
    surface.innerHTML = `<h4>${slide.title}</h4>${crossHtml(slide)}`;
  };
  const move = (delta) => { index = advanceIndex(index, delta, slides.length); render(); };

  mount.querySelector('.previous').addEventListener('click', () => move(-1));
  mount.querySelector('.next').addEventListener('click', () => move(1));
  stage.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  });
  render();
}

function initializeOodResults() {
  const mount = document.querySelector('#ood-results');
  if (!mount) return;
  mount.innerHTML = `<h4>${oodSlide.title}</h4>${oodHtml(oodSlide)}`;
}

function initializeQualitativeCarousel() {
  const mount = document.querySelector('#qualitative-carousel');
  if (!mount) return;
  const images = [
    ['assets/images/metric.png', 'Cross-dataset visual comparison.'],
    ['assets/images/more-metric-visual.png', 'Additional qualitative comparison.']
  ];
  let index = 0;
  mount.innerHTML = '<div class="carousel-stage qualitative-stage" tabindex="0" aria-label="Qualitative result images"><button class="carousel-control previous" type="button" aria-label="Show previous qualitative image">&#8249;</button><div class="carousel-surface" aria-live="polite"></div><button class="carousel-control next" type="button" aria-label="Show next qualitative image">&#8250;</button></div>';
  const stage = mount.querySelector('.carousel-stage');
  const surface = mount.querySelector('.carousel-surface');
  const render = () => { const image = images[index]; surface.innerHTML = `<figure><img src="${image[0]}" alt="${image[1]}"><figcaption>${image[1]}</figcaption></figure>`; };
  const move = (delta) => { index = advanceIndex(index, delta, images.length); render(); };
  mount.querySelector('.previous').addEventListener('click', () => move(-1));
  mount.querySelector('.next').addEventListener('click', () => move(1));
  stage.addEventListener('keydown', (event) => { if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); } if (event.key === 'ArrowRight') { event.preventDefault(); move(1); } });
  render();
}

if (typeof globalThis !== 'undefined') {
  globalThis.ResultsCarousel = { slides, oodSlide, advanceIndex, crossRankClass, rankValues };
}

if (typeof document !== 'undefined') { initializeCarousel(); initializeOodResults(); initializeQualitativeCarousel(); }
