# Fix Database Connection String - URL encode password

Write-Host "Fixing Database Connection String..." -ForegroundColor Cyan
Write-Host ""

# Your password starts with @ which needs URL encoding
# @ becomes %40 in URLs

$password = "@D7gai5hy2026"
$encodedPassword = "%40D7gai5hy2026"  # @ is encoded as %40

$connectionString = "postgresql://postgres:$encodedPassword@db.oftwzqqrepswxiloogoq.supabase.co:5432/postgres"

Write-Host "Updating .env file..." -ForegroundColor Yellow

# Read current .env file
$envContent = Get-Content .env -ErrorAction SilentlyContinue

if (-not $envContent) {
    Write-Host "Error: .env file not found!" -ForegroundColor Red
    exit 1
}

# Update DATABASE_URL
$updatedContent = $envContent | ForEach-Object {
    if ($_ -match "^DATABASE_URL=") {
        "DATABASE_URL=`"$connectionString`""
    } else {
        $_
    }
}

# Write updated content
$updatedContent | Set-Content .env

Write-Host ""
Write-Host "✓ DATABASE_URL updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Fixed: Password @ symbol is now URL-encoded" -ForegroundColor Cyan
Write-Host ""
Write-Host "Now try running:" -ForegroundColor Yellow
Write-Host "  npm run db:push" -ForegroundColor White
Write-Host ""
