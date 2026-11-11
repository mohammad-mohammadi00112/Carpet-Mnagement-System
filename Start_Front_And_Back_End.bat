@echo off

start "Backend" cmd /k "cd /d "%~dp0Back_End" && npm run dev"

start "Frontend" cmd /k "cd /d "%~dp0Front_End" && npm run dev"

exit