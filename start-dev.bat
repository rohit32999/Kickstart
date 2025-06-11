@echo off
echo Starting Kickstart Career Guidance Platform...
echo.

echo [1/4] Starting MongoDB Backend Server...
cd /d "c:\Users\karma\Documents\New folder\Kickstart - Copy\Kickstart\backend"
start "MongoDB Backend" cmd /k "node index.js"

echo [2/4] Starting Gemini Backend Server...
cd /d "c:\Users\karma\Documents\New folder\Kickstart - Copy\Kickstart\gemini-backend"
start "Gemini Backend" cmd /k "node index.js"

echo [3/4] Waiting 5 seconds for backends to initialize...
timeout /t 5 /nobreak > nul

echo [4/4] Starting Frontend Development Server...
cd /d "c:\Users\karma\Documents\New folder\Kickstart - Copy\Kickstart"
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✓ All servers are starting up!
echo.
echo [WEB] Frontend:        http://localhost:5173 (or 5174 if 5173 is busy)
echo [DB]  MongoDB Backend: http://localhost:5002  
echo [AI]  Gemini Backend:  http://localhost:5001
echo.
echo Press any key to exit this window...
pause > nul
