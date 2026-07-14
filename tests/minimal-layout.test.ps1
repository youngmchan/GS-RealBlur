$stylePath = Join-Path $PSScriptRoot '../assets/css/style.css'
if (-not (Test-Path -LiteralPath $stylePath)) {
  throw 'Missing stylesheet'
}

$style = Get-Content -LiteralPath $stylePath -Raw
$required = @(
  '--gaussian-teal: #0f766e;',
  '--action-color: #1f2a44;',
  'font-family: Arial, Helvetica, sans-serif;',
  '.gaussian-shell',
  '.research-section',
  '.publication-header',
  '.template-section',
  'font-weight: 600;',
  'font-size: clamp(2.1rem, 4vw, 3.35rem);',
  'line-height: 1.16;',
  '.authors',
  'color: var(--link-blue);',
  'display: none;',
  '.title-accent',
  'background: linear-gradient(135deg, #1f2a44 0%, #155e75 100%);',
  'background: #1f2a44;',
  'color: #fff;',
  'border-bottom: 2px solid var(--gaussian-teal);',
  'box-shadow: none;',
  '.paper-card',
  'background: transparent;',
  'text-align: center;',
  '.table-wrap',
  'overflow-x: auto;',
  '.results-table',
  '.carousel-stage',
  '.carousel-control',
  '.carousel-surface',
  '.rank-best',
  '.rank-second',
  '.bpr-results-table',
  'color: var(--best-red);',
  '.sample-grid',
  'grid-template-columns: repeat(4, minmax(0, 1fr));',
  '.sample-comparison.sample-crop-top',
  'object-position: center 25%;',
  'figure img',
  '@media (max-width: 768px)'
)

$missing = $required | Where-Object { $style -notmatch [regex]::Escape($_) }
if ($missing) {
  throw "Missing revised layout rules: $($missing -join ', ')"
}

$forbidden = @('#f4f0ea', '#fbf8f3', '#f1ebe2', '#d9d0c4')
$present = $forbidden | Where-Object { $style -match [regex]::Escape($_) }
if ($present) {
  throw "Found disallowed decorative or saturated rules: $($present -join ', ')"
}
