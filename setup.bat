@echo off
REM DelightStore Setup Script for Windows
REM Run this script after installing Node.js from https://nodejs.org/

echo DelightStore Setup Script
echo =========================
echo.

REM Check if Node.js is installed
echo Checking for Node.js...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/ and try again
    pause
    exit /b 1
)

node --version
npm --version
echo.

echo Step 1: Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed successfully
echo.

echo Step 2: Checking for .env file...
if not exist .env (
    echo [WARNING] .env file not found. Creating from .env.example...
    if exist .env.example (
        copy .env.example .env >nul
        echo [OK] .env file created. Please update it with your database credentials!
        echo.
        echo IMPORTANT: Edit .env file and set your DATABASE_URL before proceeding!
        echo.
        set /p continue="Have you updated .env with your database credentials? (y/n): "
        if /i not "%continue%"=="y" (
            echo Please update .env file and run this script again.
            pause
            exit /b 0
        )
    ) else (
        echo [ERROR] .env.example file not found!
        pause
        exit /b 1
    )
) else (
    echo [OK] .env file exists
)
echo.

echo Step 3: Generating Prisma Client...
call npm run db:generate
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to generate Prisma client
    pause
    exit /b 1
)
echo [OK] Prisma client generated
echo.

echo Step 4: Pushing database schema...
call npm run db:push
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to push database schema
    echo Make sure your DATABASE_URL in .env is correct and PostgreSQL is running
    pause
    exit /b 1
)
echo [OK] Database schema created
echo.

echo Step 5: Seeding database...
call npm run db:seed
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to seed database
    pause
    exit /b 1
)
echo [OK] Database seeded successfully
echo.

echo =========================
echo Setup Complete!
echo =========================
echo.
echo Default Admin Credentials:
echo   Email: admin@delightstore.tz.com
echo   Password: admin123
echo.
echo IMPORTANT: Change the admin password immediately!
echo.
echo To start the development server, run:
echo   npm run dev
echo.
pause
