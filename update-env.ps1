# Helper script to update .env file with database credentials

Write-Host "DelightStore - Environment Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Do you have a Supabase database? (y/n)" -ForegroundColor Yellow
$hasSupabase = Read-Host

if ($hasSupabase -eq "y" -or $hasSupabase -eq "Y") {
    Write-Host ""
    Write-Host "Please provide your Supabase connection details:" -ForegroundColor Yellow
    Write-Host "(You can find this in Supabase: Settings → Database → Connection string → URI)" -ForegroundColor Gray
    Write-Host ""
    $databaseUrl = Read-Host "Enter your full DATABASE_URL"
    
    if ($databaseUrl -match "postgresql://") {
        Write-Host ""
        Write-Host "Generating NEXTAUTH_SECRET..." -ForegroundColor Yellow
        
        # Generate a random secret key
        $secret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
        
        # Read current .env file
        $envContent = Get-Content .env
        
        # Update DATABASE_URL
        $envContent = $envContent | ForEach-Object {
            if ($_ -match "^DATABASE_URL=") {
                "DATABASE_URL=`"$databaseUrl`""
            } elseif ($_ -match "^NEXTAUTH_SECRET=") {
                "NEXTAUTH_SECRET=`"$secret`""
            } else {
                $_
            }
        }
        
        # Write updated content
        $envContent | Set-Content .env
        
        Write-Host "✓ .env file updated successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "  npm run db:push" -ForegroundColor White
        Write-Host "  npm run db:seed" -ForegroundColor White
        Write-Host "  npm run dev" -ForegroundColor White
    } else {
        Write-Host "Invalid database URL format. Should start with postgresql://" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "For local PostgreSQL:" -ForegroundColor Yellow
    Write-Host "1. Install PostgreSQL from: https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "2. Create a database named 'delightstore'" -ForegroundColor White
    Write-Host "3. Update .env file manually with:" -ForegroundColor White
    Write-Host '   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/delightstore?schema=public"' -ForegroundColor Gray
    Write-Host ""
    Write-Host "Or use Supabase (easier) - visit: https://supabase.com" -ForegroundColor Cyan
}
