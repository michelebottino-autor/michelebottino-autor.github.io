#requires -Version 5.1
# Verifica sola lettura: NON modifica pagine, repository, task o contenuti.
[CmdletBinding()]
param(
 [string]$SitemapUrl = 'https://michelebottino-autor.github.io/sitemap.xml',
 [string]$OutputCsv = "$HOME\Documents\Sito_Autore_Audit_20261015\Controllo_HTTP_Sitemap.csv"
)
$ErrorActionPreference = 'Stop'
$siteHost = 'michelebottino-autor.github.io'
$start = Get-Date
$response = Invoke-WebRequest -Uri $SitemapUrl -UseBasicParsing -TimeoutSec 20 -MaximumRedirection 3
[xml]$xml = $response.Content
$urls = @($xml.urlset.url | ForEach-Object { [string]$_.loc } | Where-Object { $_ -match '^https://' } | Select-Object -Unique)
$extra = @(
 'https://michelebottino-autor.github.io/adc/calatabiano-1922-1943/',
 'https://michelebottino-autor.github.io/adc/lapicidi-epigrafi/',
 'https://michelebottino-autor.github.io/adc/custode/'
)
$urls = @($urls + $extra | Select-Object -Unique)
if ($urls.Count -gt 150) { throw 'Troppi URL: audit annullato per prudenza.' }
$rows = New-Object 'System.Collections.Generic.List[object]'
foreach ($url in $urls) {
 $status = ''; $message = ''; $elapsed = [Diagnostics.Stopwatch]::StartNew()
 try {
  $uri = [uri]$url
  if ($uri.Host -cne $siteHost -or $uri.Scheme -ne 'https') { throw 'URL fuori dominio consentito' }
  $r = Invoke-WebRequest -Uri $url -Method Head -UseBasicParsing -TimeoutSec 12 -MaximumRedirection 3 -ErrorAction Stop
  $status = [string][int]$r.StatusCode
 } catch {
  $status = 'ERRORE'
  $message = $_.Exception.Message
 } finally { $elapsed.Stop() }
 $rows.Add([pscustomobject]@{URL=$url;Esito=$status;Dettaglio=$message;Millisec=$elapsed.ElapsedMilliseconds}) | Out-Null
}
$rows | Export-Csv -LiteralPath $OutputCsv -NoTypeInformation -Encoding UTF8
$errors = @($rows | Where-Object { $_.Esito -ne '200' })
Write-Host "CONTROLLO HTTP: $($rows.Count) URL | HTTP 200: $($rows.Count-$errors.Count) | non OK: $($errors.Count)"
Write-Host "INIZIO: $start | FINE: $(Get-Date) | CSV: $OutputCsv"
if ($errors.Count) { $errors | Select-Object URL,Esito,Dettaglio | Format-Table -AutoSize }
