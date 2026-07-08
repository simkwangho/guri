$root = "C:\Users\user1\OneDrive\바탕 화면\사주풀이"
$port = 8098
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving $root on http://localhost:$port/"

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".xml"  = "application/xml; charset=utf-8"
  ".txt"  = "text/plain; charset=utf-8"
  ".svg"  = "image/svg+xml"
}

while ($listener.IsListening) {
  try {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response
    $res.KeepAlive = $false
    $path = $req.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }
    $filePath = Join-Path $root ($path.TrimStart("/") -replace "/", "\")

    try {
      if (Test-Path $filePath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($filePath)
        $contentType = $mime[$ext]
        if (-not $contentType) { $contentType = "application/octet-stream" }
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $res.ContentType = $contentType
        $res.ContentLength64 = $bytes.Length
        if ($req.HttpMethod -ne "HEAD") {
          $res.OutputStream.Write($bytes, 0, $bytes.Length)
        }
      } else {
        $res.StatusCode = 404
        $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
        $res.ContentLength64 = $notFound.Length
        $res.OutputStream.Write($notFound, 0, $notFound.Length)
      }
    } catch {
      Write-Host "Request error: $_"
    } finally {
      $res.OutputStream.Close()
    }
  } catch {
    Write-Host "Listener error: $_"
  }
}
