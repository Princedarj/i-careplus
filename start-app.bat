@echo off
title i_CarePlus Hospital Management System
color 0b
echo ========================================================
echo   i_CarePlus - Professional Hospital Management System
echo   "Your Health, Our Priority."
echo ========================================================
echo.

:: Check if MySQL is running on port 3306
netstat -ano | find "3306" | find "LISTENING" >nul
if %errorlevel% neq 0 (
    echo [!] MySQL does not appear to be running on port 3306.
    echo [*] Attempting to start XAMPP MySQL...
    if exist "C:\xampp\mysql\bin\mysqld.exe" (
        start "" /B "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone
        timeout /t 3 /nobreak >nul
        echo [OK] XAMPP MySQL started!
    ) else (
        echo [WARNING] Please ensure MySQL or XAMPP is running before starting the app.
    )
) else (
    echo [OK] MySQL is active on port 3306.
)

echo.
echo [*] Launching Full-Stack Application (Backend + Frontend)...
echo [*] Backend will run on:  http://localhost:5000
echo [*] Frontend will run on: http://localhost:5173
echo.
echo Demo Credentials:
echo   - Admin:   admin@icareplus.com   / Admin@123
echo   - Patient: patient@icareplus.com / Patient@123
echo ========================================================
echo.

npm run dev
pause
