# Fix Database Connection String - Use Pooler Connection
# This script updates your .env file to use the Supabase pooler connection (port 6543)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fix Database Connection String" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "✗ .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file first." -ForegroundColor Yellow
    exit 1
}

Write-Host "Current .env file found." -ForegroundColor Green
Write-Host ""

# Read current .env content
$envContent = Get-Content ".env" -Raw

# Check if DATABASE_URL exists
if ($envContent -notmatch "DATABASE_URL") {
    Write-Host "✗ DATABASE_URL not found in .env file!" -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Please provide your Supabase database password:" -ForegroundColor Yellow
Write-Host "(The password you set when creating your Supabase project)" -ForegroundColor Gray
Write-Host ""
$password = Read-Host "Enter your database password" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
)

# URL encode the password (handle special characters)
$passwordEncoded = [System.Web.HttpUtility]::UrlEncode($passwordPlain)

Write-Host ""
Write-Host "Step 2: Updating connection string to use pooler (port 6543)..." -ForegroundColor Yellow

# Create the pooler connection string
$newConnectionString = "postgresql://postgres:$passwordEncoded@aws-1-eu-central-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Replace DATABASE_URL line (handle various formats)
$lines = $envContent -split "`n"
$newLines = @()
foreach ($line in $lines) {
    if ($line -match '^\s*DATABASE_URL\s*=') {
        $newLines += "DATABASE_URL=`"$newConnectionString`""
    } else {
        $newLines += $line
    }
}
$newEnvContent = $newLines -join "`n"

# Write back to .env file
$newEnvContent | Set-Content ".env" -NoNewline

Write-Host "✓ Connection string updated!" -ForegroundColor Green
Write-Host ""
Write-Host "New connection string uses:" -ForegroundColor Cyan
Write-Host "  Host: aws-1-eu-central-2.pooler.supabase.com" -ForegroundColor White
Write-Host "  Port: 6543 (pooler)" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Run: npm run db:generate" -ForegroundColor White
Write-Host "  2. Run: npm run db:seed" -ForegroundColor White
Write-Host ""
