@echo off
title MLC - Gestion des Membres (Local)
color 1F

echo.
echo  ==========================================
echo   MLC - Systeme de Gestion des Membres (Local)
echo   Lancement en mode LOCAL (sans Docker)
echo  ==========================================
echo.

pause

cd /d "%~dp0"

:: Vérification Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas installe ou n'est pas dans le PATH.
    echo Veuillez installer Node.js depuis https://nodejs.org
    pause
    exit /b 1
)

:: Démarrage automatique de Docker Compose si disponible (container Postgres)
where docker >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Docker detecte. Lancement de 'docker compose up -d' pour creer Postgres si besoin...
    docker compose up -d
    if %errorlevel% neq 0 (
        echo [WARN] 'docker compose up -d' a echoue. Verifiez Docker.
    ) else (
        echo [OK] docker compose demarre. Attente que Postgres soit prêt...
        timeout /t 8 /nobreak >nul
    )
) else (
    echo [INFO] Docker non detecte, continuation sans Docker.
)

:: Vérifier activement la disponibilité de Postgres sur le port 5434 (max 30s)
echo [INFO] Verification active de Postgres sur localhost:5434 (30s max)...
powershell -NoProfile -Command "for($i=0;$i -lt 30;$i++){ if(Test-NetConnection -ComputerName 'localhost' -Port 5434 -InformationLevel 'Quiet'){ exit 0 } Start-Sleep -Seconds 1 }; exit 1"
if %errorlevel% neq 0 (
    echo [ERROR] Postgres non disponible sur localhost:5434 apres 30s. Veuillez verifier Docker ou la configuration de la base.
    pause
    exit /b 1
) else (
    echo [OK] Postgres reachable on localhost:5434
)

:: Installer les dépendances si nécessaire
if not exist "node_modules\" (
    echo [INFO] Installation des dependances npm (avec legacy-peer-deps)...
    npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo [ERREUR] Echec de l'installation des dependances.
        pause
        exit /b 1
    )
    echo [OK] Dependances installees.
    echo.
)

:: Initialiser la base (attend que le serveur PostgreSQL local soit disponible)
echo [INFO] Verification/initialisation de la base de donnees (local)...
npm run init-db
if %errorlevel% neq 0 (
    echo [WARN] Le script init-db a rencontre un probleme, veuillez verifier manuellement.
) else (
    echo [OK] Base de donnees prête.
)

echo.
echo [INFO] Demarrage de l'application (Frontend + Backend) en mode LOCAL...
echo [INFO] Frontend: http://localhost:3000
echo [INFO] ou http://localhost:5173 si le port n'a pas ete modifie
echo [INFO] Backend:  http://localhost:5000

:: Ouverture automatique du navigateur apres 3 secondes
timeout /t 3 /nobreak >nul
start "" "http://localhost:3000"

:: Lancement concurrent de Vite et Express
call npm start

:: lorsque npm start se termine (serveurs arrêtés ou erreur), afficher un message
if %errorlevel% neq 0 (
    echo [ERREUR] Le demarrage a echoue avec le code %errorlevel%.
) else (
    echo [OK] Les serveurs sont maintenant arrêtés.
)

echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause >nul
