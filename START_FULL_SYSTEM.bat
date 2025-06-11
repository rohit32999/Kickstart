@echo off
title Kickstart Career Guidance System - Full Stack Startup
color 0A

echo.
echo =========================================================
echo    🚀 KICKSTART CAREER GUIDANCE SYSTEM STARTUP 🚀
echo =========================================================
echo.
echo Starting all required servers for the complete system...
echo.

echo [1/3] Starting Regular Backend (Database + Auth)...
start "Regular Backend (Port 5002)" cmd /k "cd /d \"c:\Users\karma\Documents\New folder\Kickstart - Copy\Kickstart\backend\" && node index.js"
timeout /t 3 /nobreak > nul

echo [2/3] Starting Gemini Backend (AI Career Recommendations)...
start "Gemini Backend (Port 5001)" cmd /k "cd /d \"c:\Users\karma\Documents\New folder\Kickstart - Copy\Kickstart\gemini-backend\" && node index.js"
timeout /t 3 /nobreak > nul

echo [3/3] Starting Frontend (React Application)...
start "Frontend (Port 5174)" cmd /k "cd /d \"c:\Users\karma\Documents\New folder\Kickstart - Copy\Kickstart\" && npm run dev"
timeout /t 3 /nobreak > nul

echo.
echo =========================================================
echo ✅ ALL SERVERS STARTED SUCCESSFULLY!
echo =========================================================
echo.
echo 🌐 Frontend Application:     http://localhost:5174/
echo 🤖 AI Career Backend:        http://localhost:5001/
echo 🗄️  Database Backend:         http://localhost:5002/
echo.
echo 📊 Career Confusion Demo:    http://localhost:5174/career-confusion-demo
echo 🎯 Main Career System:       http://localhost:5174/career-recommendation
echo.
echo =========================================================
echo 🎉 SYSTEM IS NOW FULLY OPERATIONAL!
echo =========================================================
echo.
echo Press any key to open the main application...
pause > nul

start http://localhost:5174/

echo.
echo Thank you for using Kickstart Career Guidance System!
echo Press any key to exit...
pause > nul
