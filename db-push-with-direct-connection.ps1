# Use Direct Connection for db:push (More Reliable for Schema Changes)
# This script temporarily switches to direct connection, runs db:push, then switches back

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "db:push with Direct Connection" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "✗ .env file not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Reading current .env file..." -ForegroundColor Yellow
$envContent = Get-Content ".env" -Raw
$originalContent = $envContent

# Check if DATABASE_URL exists
if ($envContent -notmatch "DATABASE_URL") {
    Write-Host "✗ DATABASE_URL not found in .env!" -ForegroundColor Red
    exit 1
}

# Extract password from current connection string
$passwordMatch = $envContent -match 'postgresql://postgres:([^@]+)@'
if (-not $passwordMatch) {
    Write-Host "✗ Could not extract password from DATABASE_URL" -ForegroundColor Red
    Write-Host "Please ensure your DATABASE_URL is in the correct format." -ForegroundColor Yellow
    exit 1
}

$password = $matches[1]

Write-Host "Step 2: Switching to direct connection (port 5432)..." -ForegroundColor Yellow

# Create direct connection string
$directConnection = "postgresql://postgres:$password@db.oftwzqqrepswxiloogoq.supabase.co:5432/postgres"

# Replace DATABASE_URL
$lines = $envContent -split "`n"
$newLines = @()
foreach ($line in $lines) {
    if ($line -match '^\s*DATABASE_URL\s*=') {
        $newLines += "DATABASE_URL=`"$directConnection`""
    } else {
        $newLines += $line
    }
}
$newEnvContent = $newLines -join "`n"
$newEnvContent | Set-Content ".env" -NoNewline

Write-Host "✓ Switched to direct connection" -ForegroundColor Green
Write-Host ""

Write-Host "Step 3: Running db:push with direct connection..." -ForegroundColor Yellow
Write-Host "(This may take 30-60 seconds)" -ForegroundColor Gray
Write-Host ""

# Run db:push
npm run db:push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ db:push completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Step 4: Switching back to pooler connection..." -ForegroundColor Yellow
    
    # Switch back to pooler
    $poolerConnection = "postgresql://postgres:$password@aws-1-eu-central-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    
    $lines = $newEnvContent -split "`n"
    $finalLines = @()
    foreach ($line in $lines) {
        if ($line -match '^\s*DATABASE_URL\s*=') {
            $finalLines += "DATABASE_URL=`"$poolerConnection`""
        } else {
            $finalLines += $line
        }
    }
    $finalContent = $finalLines -join "`n"
    $finalContent | Set-Content ".env" -NoNewline
    
    Write-Host "✓ Switched back to pooler connection" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next step: Run 'npm run db:seed' to add products" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "✗ db:push failed" -ForegroundColor Red
    Write-Host "Restoring original .env file..." -ForegroundColor Yellow
    $originalContent | Set-Content ".env" -NoNewline
    Write-Host "✓ Original .env restored" -ForegroundColor Green
}
