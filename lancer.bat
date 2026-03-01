@echo off
title MLC - Gestion des Membres
color 1F

echo.
echo  ==========================================
echo   MLC - Systeme de Gestion des Membres
echo   Lancement du serveur local...
echo  ==========================================
echo.

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

:: Tentative de demarrage automatique des conteneurs Docker si Docker est present
where docker >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Docker detecte. Verification du daemon...
    docker info >nul 2>&1
    if %errorlevel% neq 0 (
        echo [WARN] Docker detecte mais le daemon ne repond pas. Tentative de demarrage de Docker Desktop...
        if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
            start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
            timeout /t 6 /nobreak >nul
        )
    )
    echo [INFO] Lancement des services Docker (docker compose up -d)...
    docker compose up -d
    if %errorlevel% neq 0 (
        echo [WARN] docker compose a echoue, verifiez Docker ou utilisez lancer_local.bat
    ) else (
        echo [OK] Conteneurs Docker demarres.
    )
) else (
    echo [INFO] Docker non present. Continuation en mode local.
)

:: Initialiser/la base PostgreSQL (script idempotent)
echo [INFO] Verification/initialisation de la base de donnees...
npm run init-db
if %errorlevel% neq 0 (
    echo [WARN] Le script init-db a rencontre un probleme, veuillez verifier manuellement.
) else (
    echo [OK] Base de donnees prête.
)

echo.
echo [INFO] Demarrage de l'application (Frontend + Backend)...
echo [INFO] Frontend: http://localhost:3000
echo [INFO] ou http://localhost:5173 si le port n'a pas ete modifie
echo [INFO] Backend:  http://localhost:5000

echo [INFO] Appuyez sur CTRL+C pour arreter les serveurs.
echo.

:: Ouverture automatique du navigateur apres 3 secondes
timeout /t 3 /nobreak >nul
start "" "http://localhost:3000"

:: Lancement concurrent de Vite et Express
call npm start

:: lorsque npm start se termine (serveurs arrêtés ou erreur), afficher un message
if %errorlevel% neq 0 (
    echo [ERREUR] Le démarrage a échoué avec le code %errorlevel%.
) else (
    echo [OK] Les serveurs sont maintenant arrêtés.
)

echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause >nul

