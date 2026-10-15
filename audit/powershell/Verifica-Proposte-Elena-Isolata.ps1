#requires -Version 5.1
<#
Solo audit, mai pubblicazione. Eseguibile con Windows PowerShell 5.1.
Usa i testi locali ORIGINALI; il risultato non valida la ricerca storica.
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)][string]$ReportPath,
  [Parameter(Mandatory=$true)][string]$ContextPath,
  [string]$OutputPath
)
$ErrorActionPreference = 'Stop'
$report = [IO.File]::ReadAllText($ReportPath, [Text.Encoding]::UTF8)
$context = [IO.File]::ReadAllText($ContextPath, [Text.Encoding]::UTF8)
$originals = @([regex]::Matches($context, '(?m)^URL:[ \t]*(https://[^\s\r\n]+)') | ForEach-Object { $_.Groups[1].Value })
$pageHeaders = @([regex]::Matches($report, '(?m)^## Pagina[ \t]+(\d+)[ \t]*\r?$'))
$issues = New-Object 'System.Collections.Generic.List[object]'
function Add-Issue([int]$page, [int]$proposal, [string]$type, [string]$detail) {
  $issues.Add([pscustomobject]@{pagina=$page; proposta=$proposal; tipo=$type; dettaglio=$detail}) | Out-Null
}
if ($originals.Count -eq 0) { Add-Issue 0 0 'missing_context_urls' 'Contesto privo di URL originali' }
if ($pageHeaders.Count -eq 0) { Add-Issue 0 0 'missing_page_sections' 'Rapporto privo di sezioni pagina' }
for ($i=0; $i -lt $pageHeaders.Count; $i++) {
  $h = $pageHeaders[$i]
  $page = [int]$h.Groups[1].Value
  $start = $h.Index + $h.Length
  $end = if ($i+1 -lt $pageHeaders.Count) { $pageHeaders[$i+1].Index } else { $report.Length }
  $section = $report.Substring($start, $end-$start)
  $expected = if ($page -ge 1 -and $page -le $originals.Count) { $originals[$page-1] } else { $null }
  if (-not $expected) { Add-Issue $page 0 'unmapped_page' 'Indice pagina non presente nel contesto' }
  $proposals = @([regex]::Matches($section, '(?m)^\*\*Proposta[ \t]+(\d+)\*\*[ \t]*\r?$'))
  if ($proposals.Count -eq 0 -and $section -notmatch 'Nessun rilievo documentabile') {
    Add-Issue $page 0 'missing_proposals' 'Mancano proposte e dichiarazione Nessun rilievo'
  }
  for ($j=0; $j -lt $proposals.Count; $j++) {
    $pm = $proposals[$j]
    $number = [int]$pm.Groups[1].Value
    $ps = $pm.Index + $pm.Length
    $pe = if ($j+1 -lt $proposals.Count) { $proposals[$j+1].Index } else { $section.Length }
    $chunk = $section.Substring($ps, $pe-$ps)
    $fields = @{}
    foreach ($field in [regex]::Matches($chunk, '(?m)^\*\*([^*\r\n]+):\*\*[ \t]*([^\r\n]*)')) {
      $fields[$field.Groups[1].Value.Trim()] = $field.Groups[2].Value.Trim()
    }
    foreach ($required in @('URL','Azione suggerita','Fonte da verificare')) {
      if (-not $fields.ContainsKey($required) -or [string]::IsNullOrWhiteSpace($fields[$required])) {
        Add-Issue $page $number 'missing_or_empty_field' $required
      }
    }
    if (-not ($fields.ContainsKey('Rilievo') -or $fields.ContainsKey('Rilievo fondato sul testo'))) {
      Add-Issue $page $number 'missing_or_empty_field' 'Rilievo'
    }
    if ($fields.ContainsKey('URL') -and $expected) {
      $stated = $fields['URL'].Trim().TrimEnd(' ', '.', ',', ';')
      if ($stated -cne $expected) { Add-Issue $page $number 'incorrect_page_url' $stated }
    }
    foreach ($urlMatch in [regex]::Matches($chunk, 'https?://[^\s<>"''«»]+')) {
      $uriText = $urlMatch.Value.TrimEnd('.',',',';',':',')',']')
      try {
        $urlHost = ([uri]$uriText).Host
        if ($urlHost.EndsWith('github.io') -and $urlHost -cne 'michelebottino-autor.github.io') {
          Add-Issue $page $number 'altered_site_host' $uriText
        }
      } catch { Add-Issue $page $number 'invalid_url_syntax' $uriText }
    }
    if ($chunk -match '(?m)^\*\*[ \t]*$') {
      Add-Issue $page $number 'incomplete_markdown_field' 'Intestazione di campo interrotta'
    }
    foreach ($key in @('Azione suggerita','Fonte da verificare','Rilievo','Rilievo fondato sul testo')) {
      if ($fields.ContainsKey($key)) {
        $v = $fields[$key].Trim()
        if ($v.Length -gt 35 -and $v -notmatch '[.!?\)\]»”]$') {
          Add-Issue $page $number 'possible_truncation' ($key + ': ' + $v.Substring([Math]::Max(0,$v.Length-65)))
        }
      }
    }
  }
}
$status = if ($issues.Count -gt 0) { 'REJECT' } else { 'REVIEW_REQUIRED' }
$result = [ordered]@{
  stato = $status
  pagine_contesto = $originals.Count
  pagine_rapporto = $pageHeaders.Count
  anomalie = $issues.Count
  dettagli = @($issues.ToArray())
  avvertenza = 'Nessuna verifica storica o autorizzazione alla pubblicazione.'
}
$json = ConvertTo-Json -InputObject $result -Depth 6
if ($OutputPath) {
  [IO.File]::WriteAllText($OutputPath,$json,[Text.UTF8Encoding]::new($false))
}
Write-Output $json
if ($status -eq 'REJECT') { exit 1 } else { exit 0 }
