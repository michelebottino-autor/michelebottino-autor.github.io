#requires -Version 5.1
# Audit dei collegamenti interni HTML: solo GET/HEAD, nessuna modifica.
[CmdletBinding()]
param(
 [string]$SitemapUrl='https://michelebottino-autor.github.io/sitemap.xml',
 [string]$OutputCsv="$HOME\Documents\Sito_Autore_Audit_20261015\Controllo_Link_Interni.csv"
)
$ErrorActionPreference='Stop'
$allowedHost='michelebottino-autor.github.io'
[xml]$xml=(Invoke-WebRequest -Uri $SitemapUrl -UseBasicParsing -TimeoutSec 25).Content
$pages=@($xml.urlset.url|ForEach-Object {[string]$_.loc}|Where-Object {$_ -like 'https://michelebottino-autor.github.io/*'}|Select-Object -Unique)
$pages+=@('https://michelebottino-autor.github.io/adc/lapicidi-epigrafi/','https://michelebottino-autor.github.io/adc/calatabiano-1922-1943/','https://michelebottino-autor.github.io/adc/custode/')
$pages=@($pages|Select-Object -Unique)
if($pages.Count -gt 90){throw 'Pagine oltre il limite di prudenza'}
$links=New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
$sourceOf=@{}
$fetchErrors=New-Object 'System.Collections.Generic.List[object]'
foreach($page in $pages){
 try{
  $resp=Invoke-WebRequest -Uri $page -UseBasicParsing -TimeoutSec 15 -MaximumRedirection 3
  $html=[string]$resp.Content
  foreach($m in [regex]::Matches($html, '(?i)(?:href|src)[ \t]*=[ \t]*["'']([^"'']+)["'']')){
   $raw=[System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value.Trim())
   if($raw -match '^(?:#|javascript:|mailto:|tel:|data:|blob:)'){continue}
   try{
    $target=[uri]::new([uri]$page,$raw)
    if($target.Host -cne $allowedHost -or $target.Scheme -ne 'https'){continue}
    $builder=[UriBuilder]::new($target);$builder.Fragment='';$builder.Query=''
    $u=$builder.Uri.AbsoluteUri
    if($links.Add($u)){$sourceOf[$u]=$page}
   }catch{}
  }
 }catch{$fetchErrors.Add([pscustomobject]@{Pagina=$page;Errore=$_.Exception.Message})|Out-Null}
}
if($links.Count -gt 650){throw 'Link oltre il limite di prudenza; nessuna verifica massiva eseguita'}
$rows=New-Object 'System.Collections.Generic.List[object]'
foreach($u in @($links|Sort-Object)){
 $status='ERRORE';$detail=''
 try{
  $res=Invoke-WebRequest -Uri $u -UseBasicParsing -Method Head -MaximumRedirection 3 -TimeoutSec 12 -ErrorAction Stop
  $status=[string][int]$res.StatusCode
 }catch{$detail=$_.Exception.Message}
 $rows.Add([pscustomobject]@{URL=$u;Origine=$sourceOf[$u];HTTP=$status;Dettaglio=$detail})|Out-Null
}
$rows|Export-Csv -LiteralPath $OutputCsv -NoTypeInformation -Encoding UTF8
$bad=@($rows|Where-Object {$_.HTTP -ne '200'})
Write-Output ("PAGINE_HTML="+$pages.Count+"; GET_ERRORI="+$fetchErrors.Count+"; LINK_INTERNI="+$rows.Count+"; NON_200="+$bad.Count)
if($fetchErrors.Count){$fetchErrors|Format-Table -AutoSize}
if($bad.Count){$bad|Select-Object -First 30|Format-Table -AutoSize}
Write-Output ("CSV="+$OutputCsv)
