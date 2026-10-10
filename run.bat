@echo off
title AutoHeal Studio Launcher
echo ============================================================
echo   AutoHeal Studio — Intent-Aware Testing Platform
echo ============================================================
echo.
echo Starting Backend in a separate window...
start "AutoHeal Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
echo Starting Frontend in a separate window...
start "AutoHeal Frontend" cmd /k "cd frontend && npm run dev"
echo.
echo Both servers are starting up!
echo Frontend will be accessible at: http://localhost:5173
echo.
