# MLC - Système de Gestion des Membres v1.0

Plateforme officielle d'enrôlement biométrique et de génération de cartes PVC pour le MLC (Mouvement de Libération du Congo).

## 🚀 Lancement Rapide (Windows)

### Option 1: Scripts de Lancement (Recommandé)
Double-cliquez sur l'un des fichiers `.bat` dans le répertoire racine:

- **`lancer.bat`** – Lancement complet avec Docker automatique
- **`lancer_local.bat`** – Lancement local (requiert PostgreSQL local)
- **`lancer_debug.bat`** – Mode DEBUG avec tous les logs (pour dépannage)

### Option 2: Lancer Manuellement en Terminal
```bash
# Installer les dépendances
npm install --legacy-peer-deps

# Initialiser la base de données
npm run init-db

# Démarrer l'application (frontend + backend)
npm start
```

## 📋 Prérequis

- **Node.js** 18+ ([https://nodejs.org](https://nodejs.org))
- **Docker & Docker Compose** (gratuit, recommandé)
  - Télécharger: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

OU
- **PostgreSQL 15+** local installé et fonctionnant

## 🏗️ Architecture Application

| Composant | Port | URL |
|-----------|------|-----|
| **Frontend** (React) | 3000 | http://localhost:3000 |
| **Backend** (Express) | 5000 | http://localhost:5000 |
| **Database** (PostgreSQL) | 5434 | postgresql://localhost:5434/mlc_db |

## 📁 Structure Projet

```
MLC-gestion-membres/
├── App.tsx                    # Composant React principal
├── components/
│   ├── RegistrationApp.tsx   # Formulaire d'enregistrement
│   └── CardGeneratorApp.tsx  # Générateur de cartes QR
├── services/
│   └── db.ts                 # Service de communication API
├── server/
│   ├── index.js              # Backend Express
│   ├── db.js                 # Pool PostgreSQL
│   ├── init.js               # Script d'initialisation DB
│   └── schema.sql            # Schéma de la base
├── docker-compose.yml        # Configuration PostgreSQL
├── .env                      # Variables d'environnement
├── lancer.bat                # Script de lancement principal
├── lancer_local.bat          # Script lancement local
└── lancer_debug.bat          # Script DEBUG (logs complets)
```

## 🔧 Configuration

### `.env` (Variables d'Environnement)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/mlc_db
PORT=5000
```

### `docker-compose.yml` (Services Docker)
- PostgreSQL 15 avec données persistantes
- Mapping port: 5434 (hôte) → 5432 (conteneur)

## 📝 Commandes npm

```bash
npm run dev          # Démarrer Vite dev server (port 3000)
npm run server       # Démarrer Express backend (port 5000)
npm start            # Démarrer frontend + backend ensemble
npm run init-db      # Initialiser/vérifier la base de données
npm run lint         # Vérifier la syntaxe TypeScript
npm run build        # Construire pour production
```

## 🔍 Dépannage

### ❌ Frontend inaccessible (http://localhost:3000)

1. **Vérifier que les serveurs tournent:**
   ```bash
   # Affiche les processus Node
   tasklist | findstr "node"
   ```

2. **Vérifier le port 3000:**
   ```bash
   netstat -ano | findstr :3000
   ```

3. **Relancer en mode DEBUG:**
   - Double-cliquez sur `lancer_debug.bat`
   - Vérifiez les messages d'erreur dans la console

### ❌ Erreur de base de données

```bash
# Vérifier l'état de Docker
docker compose ps

# Voir les logs PostgreSQL
docker compose logs postgres

# Relancer PostgreSQL
docker compose down
docker compose up -d
```

### ❌ Module npm manquant

```bash
# Réinstaller toutes les dépendances
npm install --legacy-peer-deps
```

### ❌ Port déjà utilisé

```bash
# Trouver ce qui utilise le port (exemple: port 3000)
netstat -ano | findstr :3000

# Tuer le processus (remplacer PID par le numéro)
taskkill /PID <PID> /F
```

## 💡 Conseils

- **Première utilisation:** Utilisez `lancer.bat` (plus sûr, gère Docker automatiquement)
- **Dépannage:** Utilisez `lancer_debug.bat` pour voir tous les logs
- **Si erreur:** Vérifiez que Docker Desktop est actif/démarré
- **npm install problématique:** Ajoutez toujours le flag `--legacy-peer-deps` (qrcode.react requiert React <19)

## 📞 Support

Pour toute question ou problème:
1. Vérifiez les logs avec `lancer_debug.bat`
2. Assurez-vous que Node.js et Docker sont installés et à jour
3. Réexécutez `npm install --legacy-peer-deps`

---

**Organisation:** MLC (Mouvement de Libération du Congo)
**Version:** 1.0.0
**Dernière mise à jour:** 2026-03-01
