# Script to update DATABASE_URL in .env file

Write-Host "DelightStore - Database URL Updater" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Enter your PostgreSQL connection string:" -ForegroundColor Yellow
Write-Host "Example (Supabase): postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres" -ForegroundColor Gray
Write-Host "Example (Local): postgresql://postgres:yourpassword@localhost:5432/delightstore?schema=public" -ForegroundColor Gray
Write-Host ""

$databaseUrl = Read-Host "DATABASE_URL"

if ($databaseUrl -match "postgresql://") {
    # Read current .env file
    $envContent = Get-Content .env -ErrorAction SilentlyContinue
    
    if (-not $envContent) {
        Write-Host "Error: .env file not found!" -ForegroundColor Red
        exit 1
    }
    
    # Update DATABASE_URL
    $updatedContent = $envContent | ForEach-Object {
        if ($_ -match "^DATABASE_URL=") {
            "DATABASE_URL=`"$databaseUrl`""
        } else {
            $_
        }
    }
    
    # Write updated content
    $updatedContent | Set-Content .env
    
    Write-Host ""
    Write-Host "✓ DATABASE_URL updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  npm run db:push    # Create database tables" -ForegroundColor White
    Write-Host "  npm run db:seed    # Add products and data" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Error: Invalid connection string format!" -ForegroundColor Red
    Write-Host "Connection string must start with 'postgresql://'" -ForegroundColor Yellow
    Write-Host ""
}
