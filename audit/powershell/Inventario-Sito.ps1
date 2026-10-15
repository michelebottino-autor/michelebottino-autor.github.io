#requires -Version 5.1
<#
.SYNOPSIS
  Inventario non distruttivo e confronto di due cartelle.
.DESCRIPTION
  Legge file locali, calcola SHA-256 e produce CSV/JSON. Non modifica i file
  sorgenti, non scarica aggiornamenti, non esegue git pull/push e non elimina nulla.
.EXAMPLE
  .\Inventario-Sito.ps1 -Sorgente "C:\Percorso\Sito" -DestinazioneReport "C:\Percorso\Audit"
.EXAMPLE
  .\Inventario-Sito.ps1 -Sorgente "C:\Sito" -Confronto "C:\BackupSito" -DestinazioneReport "C:\Audit"
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)][string]$Sorgente,
  [string]$Confronto,
  [Parameter(Mandatory=$true)][string]$DestinazioneReport
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Resolve-ExistingDirectory([string]$Path) {
  $item = Get-Item -LiteralPath $Path -ErrorAction Stop
  if (-not $item.PSIsContainer) { throw "Non e' una cartella: $Path" }
  return $item.FullName.TrimEnd([IO.Path]::DirectorySeparatorChar)
}
function New-Inventory([string]$Root) {
  $rootPrefix = $Root + [IO.Path]::DirectorySeparatorChar
  $items = @(Get-ChildItem -LiteralPath $Root -File -Recurse -Force -ErrorAction Stop |
    Where-Object { $_.FullName -notmatch '[\\/](\.git|node_modules)[\\/]' -and
                   ($_.Attributes -band [IO.FileAttributes]::ReparsePoint) -eq 0 })
  $rows = foreach ($file in $items) {
    $rel = $file.FullName.Substring($rootPrefix.Length).Replace('\','/')
    [pscustomobject]@{
      Percorso = $rel
      Dimensione = $file.Length
      SHA256 = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash
      UltimaModificaUTC = $file.LastWriteTimeUtc.ToString('o')
    }
  }
  return @($rows | Sort-Object Percorso)
}
$rootA = Resolve-ExistingDirectory $Sorgente
$rootB = if ($Confronto) { Resolve-ExistingDirectory $Confronto } else { $null }
if (-not (Test-Path -LiteralPath $DestinazioneReport)) {
  New-Item -ItemType Directory -Path $DestinazioneReport -Force | Out-Null
}
$reportDir = Resolve-ExistingDirectory $DestinazioneReport
if ($reportDir -eq $rootA -or $reportDir.StartsWith($rootA + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase) -or
    ($rootB -and ($reportDir -eq $rootB -or $reportDir.StartsWith($rootB + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)))) {
  throw 'La cartella dei report deve essere esterna alle cartelle esaminate.'
}
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$a = @(New-Inventory $rootA)
$a | Export-Csv -LiteralPath (Join-Path $reportDir "inventario-A-$stamp.csv") -NoTypeInformation -Encoding UTF8
$duplicates = @($a | Group-Object SHA256 | Where-Object Count -gt 1 | ForEach-Object {
  [pscustomobject]@{ SHA256=$_.Name; NumeroFile=$_.Count; Percorsi=($_.Group.Percorso -join ' | ') }
})
$duplicates | Export-Csv -LiteralPath (Join-Path $reportDir "duplicati-esatti-$stamp.csv") -NoTypeInformation -Encoding UTF8
$comparison = @()
if ($rootB) {
  $b = @(New-Inventory $rootB)
  $b | Export-Csv -LiteralPath (Join-Path $reportDir "inventario-B-$stamp.csv") -NoTypeInformation -Encoding UTF8
  $mapA = @{}; $mapB = @{}
  foreach ($f in $a) { $mapA[$f.Percorso] = $f }
  foreach ($f in $b) { $mapB[$f.Percorso] = $f }
  $all = @($mapA.Keys + $mapB.Keys | Sort-Object -Unique)
  $comparison = @(foreach ($key in $all) {
    $inA=$mapA.ContainsKey($key); $inB=$mapB.ContainsKey($key)
    $state = if (-not $inA) {'Solo in B'} elseif (-not $inB) {'Solo in A'} elseif ($mapA[$key].SHA256 -eq $mapB[$key].SHA256) {'Identico'} else {'Diverso'}
    [pscustomobject]@{Percorso=$key; Stato=$state; SHA256_A=$(if($inA){$mapA[$key].SHA256}else{''}); SHA256_B=$(if($inB){$mapB[$key].SHA256}else{''})}
  })
  $comparison | Export-Csv -LiteralPath (Join-Path $reportDir "confronto-$stamp.csv") -NoTypeInformation -Encoding UTF8
}
$summary = [ordered]@{
  DataUTC = (Get-Date).ToUniversalTime().ToString('o')
  Sorgente = $rootA
  Confronto = $rootB
  NumeroFileA = $a.Count
  CoppieOGruppiDuplicatiA = $duplicates.Count
  NumeroRigheConfronto = $comparison.Count
  Modalita = 'Solo lettura dei sorgenti; scrittura esclusivamente nella cartella report'
}
$summary | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $reportDir "riepilogo-$stamp.json") -Encoding UTF8
Write-Host "Inventario completato: $($a.Count) file. Report in: $reportDir"
