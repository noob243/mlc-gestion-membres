# MLC - Système de Gestion des Membres v1.0

Plateforme officielle d'enrôlement biométrique et de génération de cartes PVC pour le MLC (Mouvement de Libération du Congo).

🎯 **[Lancer localement](./COMMENCEZ_ICI.txt)** | 🚀 **[Déployer sur Netlify](./GUIDE_DEPLOYMENT_NETLIFY_SUPABASE.md)** | 📖 **[Documentation Complète](./VERIFICATION_REPORT.md)**

---

## 🌐 Déploiement Production

### Option 1: Netlify + GitHub + Supabase ⭐ (Recommandé)

```bash
git push origin main
# Netlify détecte les changements une automatiquement
# → Frontend déployé sur https://your-app.netlify.app
# → Backend serverless sur Netlify Functions
# → Base de données sur Supabase
```

**Avantages:**
- ✅ Déploiement automatique à chaque push GitHub
- ✅ Base de données PostgreSQL managée (Supabase)
- ✅ Serverless (pas de serveur à maintenir)
- ✅ SSL/HTTPS automatique
- ✅ Gratuit pour petits projets

**Guide complet:** Voir [GUIDE_DEPLOYMENT_NETLIFY_SUPABASE.md](./GUIDE_DEPLOYMENT_NETLIFY_SUPABASE.md)

### Option 2: Docker + Heroku/Railway

Alternative si vous préférez un backend traditionnel avec Express.

---

## 🚀 Démarrage Rapide (Local)

### Windows - Lancement facile
```bash
Double-cliquez sur: lancer.bat
# Tout s'installe et se lance automatiquement
```

### Mac/Linux - Terminal
```bash
npm install --legacy-peer-deps
npm run dev:local    # Frontend + Backend local
npm run init-db      # Initialiser PostgreSQL (docker)
```

---

## 📋 Architecture

| Composant | Local Dev | Production |
|-----------|-----------|------------|
| **Frontend** | Vite (port 3000) | Netlify CDN |
| **Backend** | Express (port 5000) | Netlify Functions |
| **Database** | PostgreSQL 15 (Docker) | Supabase (PostgreSQL managé) |

---

## 📁 Structure Projet

```
MLC-gestion-membres/
├── 📄 App.tsx                              # Composant React principal
├── 📁 components/
│   ├── RegistrationApp.tsx                 # Formulaire d'inscription
│   └── CardGeneratorApp.tsx                # Générateur de cartes QR/PVC
├── 📁 services/
│   └── db.ts                               # Service API (local ou serverless)
├── 📁 netlify/functions/
│   └── members.js                          # Netlify Function (backend serverless)
├── 📁 server/
│   ├── index.js                            # Backend Express (dev local)
│   ├── db.js                               # Connection pool PostgreSQL
│   ├── init.js                             # Script initialisation DB
│   └── schema.sql                          # Schéma de base de données
├── 📄 vite.config.ts                       # Config Vite
├── 📄 netlify.toml                         # Config Netlify deployment
├── 📄 docker-compose.yml                   # PostgreSQL local
├── 📄 package.json                         # npm dependencies
├── 📄 .env.example                         # Variables d'environnement (template)
├── 📄 COMMENCEZ_ICI.txt                    # Guide démarrage rapide
└── 📄 GUIDE_DEPLOYMENT_NETLIFY_SUPABASE.md # Guide deployment production
```

---

## 🔧 Scripts npm

```bash
# Développement Local
npm run dev:local          # Démarrer Vite + Express
npm run dev                # Vite frontend only
npm run server             # Express backend only

# Production
npm run build              # Construire pour production
npm run netlify            # Tester build Netlify localement

# Utilitaire
npm run init-db            # Initialiser base de données (local)
npm run lint               # Vérifier TypeScript
npm run preview            # Afficher le build
```

---

## 🗄️ Dépendances Principales

- **React 19.2.4** - UI framework
- **Vite 6.4.1** - Build & dev server
- **TypeScript 5.8.3** - Type safety
- **Express 4.22.1** - Backend local
- **PostgreSQL (pg)** - Database local
- **@supabase/supabase-js** - Client Supabase production
- **lucide-react** - UI icons
- **qrcode.react** - QR code generation

---

## 🌍 Variables d'Environnement

### Local (`.env`)
```env
VITE_SUPABASE_URL=postgresql://postgres:postgres@localhost:5434/mlc_db
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/mlc_db
PORT=5000
```

### Production (Netlify Dashboard)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **NE JAMAIS commiter `.env` avec des secrets!** Utiliser `.env.example` + Netlify Dashboard.

---

## 🔐 Sécurité

- ✅ Policies Supabase RLS (Row Level Security) activées
- ✅ HTTPS automatique (Netlify)
- ✅ Secrets managés par Netlify (jamais dans Git)
- ✅ CORS configuré dans netlify.toml
- ✅ Fonctions serverless (pas de serveur à patcher)

---

## 🐛 Dépannage

### Frontend inaccessible
```bash
# Vérifier les ports:
netstat -ano | findstr :3000    # Windows
lsof -i :3000                   # Mac/Linux

# Relancer:
npm run dev:local
```

### Erreur base de données
```bash
# Vérifier Docker:
docker compose ps
docker compose down
docker compose up -d

# Relancer:
npm run init-db
```

### Erreur Netlify Functions
```bash
# Tester localement:
npm run netlify

# Voir les logs:
# Netlify Dashboard → Functions → members
```

---

## 📞 Support

- 📖 Documentation locale: Files `*.md` dans le repo
- 🐙 Code source: https://github.com/YourUsername/mlc-gestion-membres
- 🚀 App en production: https://your-app.netlify.app

---

## 📜 License

Copyright © 2026 - MLC (Mouvement de Libération du Congo)

---

**Dernière mise à jour:** 2026-03-01  
**Status:** ✅ Production Ready
