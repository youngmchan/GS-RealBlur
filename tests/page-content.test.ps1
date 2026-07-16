$pagePath = Join-Path $PSScriptRoot '../index.html'

if (-not (Test-Path -LiteralPath $pagePath)) {
  throw 'Missing page entry point: Code/index.html'
}

$page = Get-Content -LiteralPath $pagePath -Raw
$required = @(
  'GS-RealBlur',
  'gaussian-shell',
  'publication-header',
  'template-section',
  'Academic Project Page Template',
  'class="paper-card abstract-card"',
  'class="paper-card comparison-card"',
  'class="paper-card method-card"',
  'class="paper-card experiment-card"',
  'id="results-carousel"',
  'id="ood-results"',
  'assets/js/results-carousel.js',
  'id="abstract"',
  'id="difference"',
  'id="method"',
  'id="experiments"',
  'id="dataset-samples"',
  'assets/paper/GS-RealBlur.pdf',
  'assets/images/real-world-blur.png',
  'assets/images/pipeline.png',
  'assets/images/BPR_compare.png',
  'id="qualitative-carousel"',
  '📄 Paper (PDF)',
  'class="results-table bpr-results-table"',
  'class="sample-comparison"',
  'data-blur-src=',
  'data-gt-src=',
  'assets/js/sample-comparison.js'
)

$missing = $required | Where-Object { $page -notmatch [regex]::Escape($_) }
if ($missing) {
  throw "Missing required page content: $($missing -join ', ')"
}

$orderedIds = @('abstract', 'difference', 'method', 'experiments', 'dataset-samples')
$positions = $orderedIds | ForEach-Object { $page.IndexOf("id=`"$_`"") }
$sortedPositions = $positions | Sort-Object
if ($positions -contains -1 -or (($positions -join ',') -ne ($sortedPositions -join ','))) {
  throw 'Page sections are not in the approved order.'
}

$crossDatasetStart = $page.IndexOf('id="cross-dataset-title"')
$oodStart = $page.IndexOf('id="ood-title"')
$qualitativeStart = $page.IndexOf('id="qualitative-title"')
$bprStart = $page.IndexOf('id="bpr-title"')
if ($crossDatasetStart -lt 0 -or $oodStart -lt 0 -or $qualitativeStart -lt 0 -or $bprStart -lt 0) { throw 'Missing cross-dataset, OOD, qualitative, or BPR card.' }
if (($crossDatasetStart -ge $qualitativeStart) -or ($qualitativeStart -ge $oodStart)) { throw 'Qualitative Results must follow cross-dataset results and precede the OOD card.' }
$crossDatasetEnd = $page.IndexOf('</article>', $crossDatasetStart)
if ($page.Substring($crossDatasetStart, $crossDatasetEnd - $crossDatasetStart) -match 'more-metric-visual.png') { throw 'The supplementary visual must not be embedded inside the cross-dataset card.' }
$carouselSource = Get-Content -LiteralPath (Join-Path $PSScriptRoot '../assets/js/results-carousel.js') -Raw
if ($carouselSource -notmatch [regex]::Escape('assets/images/more-metric-visual.png')) { throw 'The supplementary cross-dataset visual must remain in the Qualitative Results carousel.' }
if ($page -match 'carousel-count') { throw 'Carousel counter is still present.' }
if ($page -match 'Dataset samples will be added here.') { throw 'Dataset sample placeholders are still present.' }
$sampleCardCount = ([regex]::Matches($page, '<article class="[^"]*sample-comparison')).Count
if ($sampleCardCount -ne 20) { throw "Expected 20 curated dataset samples, found $sampleCardCount." }
$retainedSources = @(
  '002_00039_patch_8.png', 'kaola_00045_patch18.png', 'lipai_00008_patch_2.png',
  '008_00330_patch_7.png',
  '009_00274_patch_0.png', '009_00275_patch_3.png',
  '019_00008_patch_10.png', '020_00123_patch_8.png', '020_00197_patch_7.png',
  'kaola_00045_patch11.png', 'meeting-room_00013_patch_7.png',
  'jiankong_00169_patch_10.png', 'milk_00005_patch_7.png',
  '074_00085_patch_6.png', '2b-car_00021_patch18.png', 'corn_00009_patch_7.png',
  'milk_00078_patch_4.png', 'nigemaiti_00049_patch_1.png', 'SF-line_00173_patch4.png',
  'white-car-2_00117_patch_4.png'
)
$missingRetained = $retainedSources | Where-Object { $page -notmatch [regex]::Escape($_) }
if ($missingRetained) { throw "Missing retained or newly curated samples: $($missingRetained -join ', ')" }
$removedSources = @(
  '2b-car_00046_patch14.png',
  'egg_00022_patch_0.png',
  '006_00122_patch_0.png',
  '071_00132_patch_6.png',
  '071_00133_patch_7.png',
  '008_00291_patch_4.png',
  '036_00064_patch_7.png',
  '046_00046_patch_10.png',
  'K1_00020_patch10.png',
  'gray-car_00071_patch9.png', 'caiyuan_00003_patch_9.png', 'counter_00056_patch_5.png',
  '008_00295_patch_7.png', '008_00331_patch_4.png', '020_00182_patch_1.png',
  '036_00048_patch_9.png', '036_00064_patch_9.png', '074_00055_patch_7.png',
  '2b-car_00014_patch18.png', '009_00275_patch_0.png', '046_00046_patch_8.png',
  'signlight_00014_patch_9.png', 'gray-car_00107_patch12.png', '071_00146_patch_6.png',
  'jiankong_00051_patch_13.png', '024_00121_patch_13.png'
)
$staleReplacement = $removedSources | Where-Object { $page -match [regex]::Escape($_) }
if ($staleReplacement) { throw "Replaced samples are still referenced: $($staleReplacement -join ', ')" }
$sampleLabels = [regex]::Matches($page, 'data-sample-name="(Sample (?:0[1-9]|1[0-9]|20))"') | ForEach-Object { $_.Groups[1].Value }
$expectedLabels = 1..20 | ForEach-Object { 'Sample {0:D2}' -f $_ }
if (($sampleLabels -join '|') -ne ($expectedLabels -join '|')) { throw 'Sample labels must run consecutively from Sample 01 through Sample 20.' }
foreach ($mapping in @(
  'white-car-2_00117_patch_4.png" data-gt-src="assets/images/samples/gt/white-car-2_00117_patch_4.png" data-sample-name="Sample 16"',
  'SF-line_00173_patch4.png" data-gt-src="assets/images/samples/gt/SF-line_00173_patch4.png" data-sample-name="Sample 17"',
  'nigemaiti_00049_patch_1.png" data-gt-src="assets/images/samples/gt/nigemaiti_00049_patch_1.png" data-sample-name="Sample 18"'
)) { if ($page -notmatch [regex]::Escape($mapping)) { throw "Missing requested sample replacement: $mapping" } }
if ($page -notmatch 'sample-crop-top') { throw 'Sample 22 crop marker is missing.' }
if ($page -match 'sample-color-aligned') { throw 'Sample 23 must use the original, unfiltered image.' }

$forbidden = @('Coming soon', 'data-soon', 'linear-gradient')
$present = $forbidden | Where-Object { $page -match [regex]::Escape($_) }
if ($present) {
  throw "Found removed page content: $($present -join ', ')"
}
