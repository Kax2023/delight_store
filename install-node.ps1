# Quick Node.js Installation Helper Script
# This script will help you verify if Node.js is installed and guide you through installation

Write-Host "Node.js and npm Installation Checker" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if node is available in PATH
$nodeInPath = Get-Command node -ErrorAction SilentlyContinue
$npmInPath = Get-Command npm -ErrorAction SilentlyContinue

if ($nodeInPath -and $npmInPath) {
    Write-Host "✓ Node.js is already installed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Node.js version: " -NoNewline
    node --version
    Write-Host "npm version: " -NoNewline
    npm --version
    Write-Host ""
    Write-Host "You're ready to go! Run:" -ForegroundColor Green
    Write-Host "  npm install" -ForegroundColor White
} else {
    Write-Host "✗ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please follow these steps:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Download Node.js from: https://nodejs.org/" -ForegroundColor White
    Write-Host "   - Click the LTS (Long Term Support) version" -ForegroundColor Gray
    Write-Host "   - Download the Windows Installer (.msi file)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Run the installer:" -ForegroundColor White
    Write-Host "   - Double-click the downloaded .msi file" -ForegroundColor Gray
    Write-Host "   - Follow the installation wizard" -ForegroundColor Gray
    Write-Host "   - Make sure 'Add to PATH' is checked" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. After installation:" -ForegroundColor White
    Write-Host "   - CLOSE and REOPEN this terminal/IDE" -ForegroundColor Yellow
    Write-Host "   - Run this script again to verify" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Would you like me to open the Node.js download page? (y/n)" -ForegroundColor Cyan
    $open = Read-Host
    if ($open -eq "y" -or $open -eq "Y") {
        Start-Process "https://nodejs.org/"
        Write-Host ""
        Write-Host "Download page opened in your browser!" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
