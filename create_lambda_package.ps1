# PowerShell script để tạo Lambda deployment package cho Windows

Write-Host "🚀 Tạo Lambda deployment package..." -ForegroundColor Green

# Tạo thư mục tạm
$tempDir = "lambda-deployment"
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

Write-Host "📁 Copy lambda_function.py..." -ForegroundColor Yellow
Copy-Item "lambda_function.py" -Destination "$tempDir\lambda_function.py"

Write-Host "📦 Cài đặt dependencies (boto3)..." -ForegroundColor Yellow
Set-Location $tempDir
pip install boto3 -t . --quiet
Set-Location ..

Write-Host "📦 Tạo zip file..." -ForegroundColor Yellow
$zipFile = "lambda-function.zip"
if (Test-Path $zipFile) {
    Remove-Item $zipFile
}

# Zip nội dung thư mục (không zip thư mục)
Get-ChildItem -Path $tempDir | Compress-Archive -DestinationPath $zipFile -Force

Write-Host "🧹 Dọn dẹp..." -ForegroundColor Yellow
Remove-Item -Recurse -Force $tempDir

Write-Host "✅ Hoàn tất! File: $zipFile" -ForegroundColor Green
Write-Host "📤 Bây giờ bạn có thể upload file này lên Lambda Console" -ForegroundColor Cyan

