$expectedAssets = @(
  'Blur-Distri.png',
  'BPR_compare.png',
  'Cutmix-Dy.png',
  'metric.png',
  'more-metric-visual.png',
  'nr-metric.png',
  'pipeline.png',
  'real-world-blur.png'
)

$missing = $expectedAssets | Where-Object {
  -not (Test-Path -LiteralPath (Join-Path $PSScriptRoot "../assets/images/$_"))
}

if ($missing) {
  throw "Missing bundled assets: $($missing -join ', ')"
}
