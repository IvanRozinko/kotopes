@echo off
REM Deploy script for Kotopes - Run locally before git push
REM Windows version (PowerShell recommended)

echo.
echo ========================================
echo Kotopes Production Deployment
echo ========================================
echo.

echo 1. Building React app...
call npm run build

if errorlevel 1 (
  echo.
  echo ERROR: Build failed!
  exit /b 1
)

echo.
echo ========================================
echo Build successful!
echo ========================================
echo.
echo Next steps:
echo   1. Commit changes: git add -A && git commit -m "Build: production React build"
echo   2. Push to GitHub: git push origin main
echo   3. On CityHosting server:
echo      - cd /var/www/kotopes
echo      - git pull origin main
echo      - npm install (if package.json changed)
echo      - pm2 restart kotopes (or NODE_ENV=production PORT=3000 node server/index.js)
echo.
echo Test locally:
echo   npm run build:prod
echo   Then visit http://localhost:3000
echo.
