$page = Get-Content -LiteralPath (Join-Path $PSScriptRoot '../index.html') -Raw
$script = Get-Content -LiteralPath (Join-Path $PSScriptRoot '../assets/js/results-carousel.js') -Raw

if ($page -match '<script\s+type="module"\s+src="assets/js/results-carousel\.js"') {
  throw 'Carousel must use a classic script so it runs from file:/// previews.'
}

if ($script -match '(?m)^export\s') {
  throw 'Carousel source must not use ES module exports in a file:/// preview.'
}
