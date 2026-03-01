# Script to set up Supabase connection string in .env

Write-Host "DelightStore - Supabase Database Setup" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

$connectionString = "postgresql://postgres:[YOUR-PASSWORD]@db.oftwzqqrepswxiloogoq.supabase.co:5432/postgres"

Write-Host "Your Supabase connection string:" -ForegroundColor Yellow
Write-Host $connectionString -ForegroundColor White
Write-Host ""

Write-Host "Enter your Supabase database password:" -ForegroundColor Cyan
Write-Host "(This is the password you created when setting up your Supabase project)" -ForegroundColor Gray
$password = Read-Host "Password" -AsSecureString

# Convert secure string to plain text
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Replace [YOUR-PASSWORD] with actual password
$finalConnectionString = $connectionString.Replace("[YOUR-PASSWORD]", $plainPassword)

Write-Host ""
Write-Host "Updating .env file..." -ForegroundColor Yellow

# Read current .env file
$envPath = ".env"
if (-not (Test-Path $envPath)) {
    Write-Host "Error: .env file not found!" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content $envPath

# Update DATABASE_URL
$updatedContent = $envContent | ForEach-Object {
    if ($_ -match "^DATABASE_URL=") {
        "DATABASE_URL=`"$finalConnectionString`""
    } else {
        $_
    }
}

# Write updated content
$updatedContent | Set-Content $envPath

Write-Host ""
Write-Host "✓ DATABASE_URL updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. npm run db:push    # Create database tables" -ForegroundColor White
Write-Host "  2. npm run db:seed    # Add products and data" -ForegroundColor White
Write-Host "  3. npm run dev        # Start your website" -ForegroundColor White
Write-Host ""
