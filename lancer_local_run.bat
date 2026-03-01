@echo off
title MLC - Debug Run Local
color 1F

set LOG=%~dp0lancer_local_run.log
echo Debug run started at %date% %time%>"%LOG%"

cd /d "%~dp0"
echo [STEP] cd to %cd%>>"%LOG%"

echo [STEP] check node...>>"%LOG%"
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node not found >>"%LOG%"
    echo Node.js not found. See log %LOG%
    echo Appuyez sur une touche pour continuer...
    pause
    exit /b 1
) else (
    echo [OK] node found >>"%LOG%"
)

if not exist "node_modules\" (
    echo [STEP] npm install --legacy-peer-deps >>"%LOG%"
    npm install --legacy-peer-deps >>"%LOG%" 2>&1
    echo [STEP] npm install exit %errorlevel% >>"%LOG%"
        if %errorlevel% neq 0 (
        echo [ERROR] npm install failed >>"%LOG%"
        type "%LOG%"
        echo Appuyez sur une touche pour continuer...
        pause
        exit /b 1
    )
)

echo [STEP] running init-db >>"%LOG%"
npm run init-db >>"%LOG%" 2>&1
set INITERR=%errorlevel%
echo [STEP] init-db exit %INITERR% >>"%LOG%"
if %INITERR% neq 0 (
    echo [WARN] init-db failed with code %INITERR% >>"%LOG%"
    echo [STEP] checking for Docker to attempt recovery >>"%LOG%"
    where docker >nul 2>&1
    if %errorlevel% equ 0 (
        echo [STEP] Docker found, attempting 'docker compose up -d' >>"%LOG%"
        docker compose up -d >>"%LOG%" 2>&1
        echo [STEP] docker compose exit %errorlevel% >>"%LOG%"
        timeout /t 3 /nobreak >nul
        echo [STEP] retrying init-db >>"%LOG%"
        npm run init-db >>"%LOG%" 2>&1
        echo [STEP] init-db retry exit %errorlevel% >>"%LOG%"
        if %errorlevel% neq 0 (
            echo [ERROR] init-db failed after docker retry >>"%LOG%"
            type "%LOG%"
            exit /b 1
        )
    ) else (
        echo [WARN] Docker not available; cannot auto-recover >>"%LOG%"
        type "%LOG%"
        exit /b 1
    )
)

echo [STEP] opening browser >>"%LOG%"
start "" "http://localhost:3000"

echo [STEP] starting npm start >>"%LOG%"
call npm start >>"%LOG%" 2>&1
echo [STEP] npm start exit %errorlevel% >>"%LOG%"

echo Debug run finished at %date% %time%>>"%LOG%"
type "%LOG%"

pause
