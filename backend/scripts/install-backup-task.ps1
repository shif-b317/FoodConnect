param(
  [string]$TaskName = 'FOOD_CONNECT_MongoDB_Backup',
  [string]$StartTime = '02:30'
)

$ErrorActionPreference = 'Stop'
$backupScript = (Resolve-Path (Join-Path $PSScriptRoot 'backup-mongo.ps1')).Path
$powershellExe = Join-Path $PSHOME 'powershell.exe'
$action = New-ScheduledTaskAction -Execute $powershellExe -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$backupScript`""
$trigger = New-ScheduledTaskTrigger -Daily -At ([DateTime]::ParseExact($StartTime, 'HH:mm', $null))
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Limited
Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Principal $principal -Description 'Create a compressed FOOD CONNECT MongoDB backup each day.' -Force | Out-Null
Write-Output "Daily backup task '$TaskName' installed for $StartTime. It runs while $env:USERNAME is signed in."
