param(
  [string]$OutputDirectory = (Join-Path $PSScriptRoot '..\backups')
)

$ErrorActionPreference = 'Stop'
if (-not $env:MONGODB_URI) {
  $environmentFile = Join-Path $PSScriptRoot '..\.env'
  if (Test-Path -LiteralPath $environmentFile) {
    $uriLine = Get-Content -LiteralPath $environmentFile | Where-Object { $_ -match '^\s*MONGODB_URI=' } | Select-Object -First 1
    if ($uriLine) { $env:MONGODB_URI = $uriLine.Substring($uriLine.IndexOf('=') + 1).Trim().Trim('"', "'") }
  }
}
if (-not $env:MONGODB_URI) { throw 'Set MONGODB_URI in the environment before running a database backup.' }
$mongodump = Get-Command mongodump -ErrorAction SilentlyContinue
if (-not $mongodump) { throw 'MongoDB Database Tools (mongodump) must be installed and available on PATH.' }

$resolvedOutput = [System.IO.Path]::GetFullPath($OutputDirectory)
New-Item -ItemType Directory -Path $resolvedOutput -Force | Out-Null
$archive = Join-Path $resolvedOutput ("food-connect-{0}.archive.gz" -f (Get-Date -Format 'yyyyMMdd-HHmmss'))
& $mongodump.Source "--uri=$env:MONGODB_URI" "--archive=$archive" --gzip
if ($LASTEXITCODE -ne 0) { Remove-Item -LiteralPath $archive -Force -ErrorAction SilentlyContinue; throw "mongodump failed with exit code $LASTEXITCODE." }
Write-Output "Backup created: $archive"
