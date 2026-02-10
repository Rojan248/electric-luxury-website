@echo off
echo ================================================
echo   ELECTRIC LUXURY - Local Development Server
echo ================================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Starting server with Python...
    echo.
    echo Server running at: http://localhost:8000
    echo Press Ctrl+C to stop the server
    echo.
    python -m http.server 8000
    goto :end
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python not found. Trying Node.js...
    echo Installing 'serve' package...
    npx -y serve -l 8000
    goto :end
)

REM If neither is available
echo ERROR: Neither Python nor Node.js found!
echo.
echo Please install one of the following:
echo   - Python 3: https://www.python.org/downloads/
echo   - Node.js: https://nodejs.org/
echo.
pause
goto :end

:end
