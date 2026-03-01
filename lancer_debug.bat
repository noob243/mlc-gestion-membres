@echo off
title MLC - Gestion des Membres (DEBUG MODE)
color 2F

echo.
echo  =======================================================
echo   MLC - Systeme de Gestion des Membres - DEBUG MODE
echo   Tous les logs sont affiches pour diagnostic
echo  =======================================================
echo.

cd /d "%~dp0"

:: Verification Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas installe ou n'est pas dans le PATH.
    echo Veuillez installer Node.js depuis https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js detecte

:: Demarrage de Docker
where docker >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo [INFO] ------- Docker Compose UP -------
    docker compose up -d
    if %errorlevel% equ 0 (
        echo [OK] Docker compose demarre. Attente 5s pour que Postgres soit pret...
        timeout /t 5 /nobreak >nul
    ) else (
        echo [WARN] docker compose a echoue, continuons quand meme...
    )
) else (
    echo [INFO] Docker non detecte
)

:: Verification Postgres
echo.
echo [INFO] ------- Verification Postgres (port 5434) -------
powershell -NoProfile -Command "$result = Test-NetConnection -ComputerName 'localhost' -Port 5434 -InformationLevel 'Quiet'; if($result) { Write-Host '[OK] Postgres accessible' } else { Write-Host '[ERROR] Postgres NOT accessible'; exit 1 }"
if %errorlevel% neq 0 (
    echo [ERROR] Postgres non disponible! Verifiez docker compose ou la config de base de donnees.
    pause
    exit /b 1
)

:: Installer les dependances
if not exist "node_modules\" (
    echo.
    echo [INFO] ------- NPM Install -------
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo [ERREUR] Echec npm install
        pause
        exit /b 1
    )
)

:: Initialiser la base
echo.
echo [INFO] ------- Database Init -------
call npm run init-db
if %errorlevel% neq 0 (
    echo [WARN] init-db a echoue, continuons quand meme...
)

:: Afficher l'URL
echo.
echo  =======================================================
echo   SERVICES DEMARRES:
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:5000
echo   Database:  localhost:5434
echo  =======================================================
echo.
echo [INFO] Appuyez sur CTRL+C pour arreter.
echo.

:: Ouverture du navigateur apres 2 secondes
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"

:: Demarrage avec npm start - affiche tout
echo [INFO] ------- NPM Start (Frontend + Backend) -------
call npm start

:: Si npm start se termine (erreur ou CTRL+C)
echo.
echo [INFO] Arret des serveurs...
pause
