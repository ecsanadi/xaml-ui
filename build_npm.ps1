Write-Host 'Collecting build version information...' -ForegroundColor Magenta
$version = if ($null -ne $env:APPVEYOR_BUILD_VERSION) { $env:APPVEYOR_BUILD_VERSION } else { "1.0.0.0" }
$version = [Version]::Parse($version).ToString(3)
Write-Host "Version: $version"

Write-Host 'Creating output directory...' -ForegroundColor Magenta
New-Item -Path '.\Output' -ItemType Directory -Force

Write-Host 'Updating package.json...' -ForegroundColor Magenta

$packageJson = Get-Content ./projects/xaml-ui/package.json | ConvertFrom-Json
$packageJson.version = $version
Set-Content ./projects/xaml-ui/package.json -Value ($packageJson | ConvertTo-Json)

Write-Host 'Installing dependencies...' -ForegroundColor Magenta
npm install

Write-Host 'Building xaml-ui...' -ForegroundColor Magenta
npm run build xaml-ui

if ($LastExitCode -eq 0) {
  Write-Host "Building xaml-ui succeeded!" -ForegroundColor Green
}
else {
  Write-Host "Building xaml-ui failed!" -ForegroundColor Red 
  throw "Building xaml-ui failed!"
}

Write-Host 'Creating npm package...' -ForegroundColor Magenta
Push-Location ./dist/xaml-ui

if ($env:APPVEYOR) {
  Write-Host 'Publishing npm package...' -ForegroundColor Magenta
  npm config set //registry.npmjs.org/:_authToken=$env:NPM_TOKEN
  npm publish
} else {
  npm pack --pack-destination="../../../Output"
}

Pop-Location

Write-Host 'Done.' -ForegroundColor Green