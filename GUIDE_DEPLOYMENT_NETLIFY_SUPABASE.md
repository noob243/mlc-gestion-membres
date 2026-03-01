# 🚀 GUIDE: Déploiement Netlify + Supabase

Guide étape par étape pour mettre en ligne l'application MLC sur Netlify avec Supabase comme base de données.

---

## 📋 Prérequis

- [GitHub Account](https://github.com) (compte gratuit)
- [Netlify Account](https://app.netlify.com) (gratuit)
- [Supabase Account](https://app.supabase.com) (gratuit)
- Git installé localement
- Node.js 18+ installé

---

## Phase 1: Configuration Supabase (5 minutes)

### 1.1 Créer un projet Supabase

1. Allez sur [app.supabase.com](https://app.supabase.com)
2. Cliquez **"New Project"**
3. Remplissez les champs:
   - **Project name**: `mlc-gestion-membres`
   - **Database password**: Utilisez un mot de passe fort (>16 chars)
   - **Region**: Choisissez `eu-paris` (France) ou la plus proche
4. Cliquez **"Create New Project"** et attendez ~2 minutes

### 1.2 Créer la table Members

1. Dans Supabase, allez à **SQL Editor** (menu gauche)
2. Cliquez **"New Query"**
3. Copier-collez ce SQL:

```sql
-- Créer la table members
CREATE TABLE members (
    id VARCHAR(50) PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    post_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    sexe VARCHAR(1) NOT NULL,
    birth_date DATE NOT NULL,
    country VARCHAR(100) NOT NULL,
    city_province VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    federation VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    photo_url TEXT
);

-- Activer Row Level Security (RLS)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Politique publique pour lecture
CREATE POLICY "Allow public read" ON members
    FOR SELECT USING (true);

-- Politique publique pour insertion
CREATE POLICY "Allow public insert" ON members
    FOR INSERT WITH CHECK (true);
```

4. Cliquez **"Run"** (ou CTRL+ENTER)
5. ✅ Table créée!

### 1.3 Récupérer les API Keys

1. Allez à **Settings** → **API** (menu gauche en bas)
2. Copier les valeurs:
   - **Project URL** ("supabase_url")
   - **anon -public** ("supabase_anon_key")
3. ⚠️ **NE JAMAIS partager le service_role key** (secret)

Gardez ces valeurs à proximité pour l'étape suivante.

---

## Phase 2: Configuration GitHub (5 minutes)

### 2.1 Créer un repo GitHub

1. Allez sur [github.com/new](https://github.com/new)
2. Remplissez:
   - **Name**: `mlc-gestion-membres`
   - **Description**: `Système de gestion des membres MLC`
   - **Visibility**: Public (ou Private si préférez)
3. Cliquez **"Create Repository"**
4. ✅ Repository créé!

### 2.2 Pousser le code local vers GitHub

1. Ouvrez un terminal dans le répertoire du projet
2. Initialisez Git et poussez:

```bash
# Initialiser git (si pas déjà fait)
git init

# Ajouter le remote (remplacer YOUR_USERNAME et YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/mlc-gestion-membres.git

# Ajouter tous les fichiers
git add .

# Commit initial
git commit -m "Initial commit: MLC Gestion Membres - Netlify ready"

# Pousser vers GitHub (remplacer main si branche différente)
git branch -M main
git push -u origin main
```

3. ✅ Code sur GitHub!

### 2.3 Créer .env.production.local (non-committable)

Pour le développement local, créez `.env.production.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ Ce fichier ne sera pas poussé (dans .gitignore).

---

## Phase 3: Déploiement Netlify (5 minutes)

### 3.1 Connecter GitHub à Netlify

1. Allez sur [app.netlify.com](https://app.netlify.com)
2. Cliquez **"Add new site"** → **"Import an existing project"**
3. Choisissez **"GitHub"** et autorisez les permissions
4. Sélectionnez votre repository `mlc-gestion-membres`
5. ✅ Netlify trouve automatiquement `netlify.toml`!

### 3.2 Configurer les variables d'environnement

1. Dans Netlify, allez à **Site settings** → **Build & deploy** → **Environment**
2. Cliquez **"Edit variables"**
3. Ajoutez vos variables Supabase:

| Clé | Valeur |
|-----|--------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1...` |

4. Cliquez **"Save"**
5. ✅ Variables configurées!

### 3.3 Déclencher un déploiement

1. Attendez que Netlify détecte les changements  
   (OU cliquez **"Trigger deploy"** dans Netlify)
2. Observez le **Deploy log** (doit afficher):
   ```
   npm install --legacy-peer-deps
   npm run build
   Functions bundled and ready to deploy
   ✓ Deployment successful!
   ```
3. Accédez à votre site: https://your-site.netlify.app
4. ✅ Application en ligne!

---

## Phase 4: Tests & Vérification (5 minutes)

### 4.1 Tester le frontend

1. Allez sur votre URL Netlify
2. Vérifiez que l'app se charge
3. Testez l'enregistrement d'un membre:
   - Remplissez le formulaire
   - Cliquez "Enregistrer"
   - Vérifiez que le membre apparaît dans la liste

### 4.2 Vérifier les données dans Supabase

1. Allez sur [app.supabase.com](https://app.supabase.com)
2. Allez à **Table Editor** → **members**
3. Vérifiez que vos données de test sont présentes
4. ✅ Data roundtrip OK!

### 4.3 Vérifier les logs

**Netlify Functions logs:**
```
Netlify Dashboard → Functions → members
```

**Supabase logs:**
```
Supabase Dashboard → Logs → Database (si besoin)
```

---

## 🔐 Maintenance & Sécurité

### Variables d'env secrets

```bash
# ❌ JAMAIS faire ça:
git commit -am "Add Supabase key" # Key exposée!

# ✅ TOUJOURS faire ça:
# 1. Ajouter à .gitignore
# 2. Configurer dans Netlify Dashboard
# 3. Utiliser localement via .env.local (non-committed)
```

### Renouveler les keys (tous les 3-6 mois)

1. Allez à Supabase → Settings → API
2. Cliquez "Rotate key"
3. Mettez à jour dans Netlify Dashboard → Site settings
4. Redéployez

---

## 🚨 Troubleshooting

### ❌ "Erreur 404 - Frontend pas trouvé"
**Solution:**
- Vérifiez que `netlify.toml` existe
- Vérifiez que `vite build` produit une sortie dans `dist/`
- Vérifiez les "Deploy logs" sur Netlify

### ❌ "API endpoints retournent 500"
**Solution:**
- Vérifiez les variables VITE_SUPABASE_* dans Netlify
- Consultez les logs Netlify Functions
- Vérifiez la table `members` existe dans Supabase

### ❌ "Connexion Supabase timeout"
**Solution:**
- Vérifiez que vous utilisez l'URL correcte (https, pas http)
- Essayez la région Supabase la plus proche
- Vérifiez les politiques RLS dans Supabase

### ❌ "Erreur CORS"
**Solution:**
- Vérifiez que netlify.toml a les headers CORS
- Supabase handle automatiquement CORS
- Vérifiez les logs du navigateur (F12 → Console)

---

## 📊 Architecture Production

```
GitHub Repository
        ↓
    [git push]
        ↓
Netlify (connected to GitHub)
    ├─ Frontend (React/Vite)
    │  └─ Déployé sur CDN Netlify
    ├─ Netlify Functions (Backend)
    │  └─ serverless/members.js
    └─ Build trigger on git push
        ↓
Supabase (PostgreSQL managé + API)
    ├─ Table: members
    ├─ Row Level Security (RLS)
    └─ Backups automatiques
```

---

## 📈 Prochaines Étapes (Optionnel)

- [ ] Configurer un domaine personnalisé
- [ ] Ajouter Let's Encrypt HTTPS (automatique Netlify)
- [ ] Configurer les emails (Supabase Auth)
- [ ] Ajouter une base de données pour utilisateurs
- [ ] Mettre en place les analytics
- [ ] Configurer les backups Supabase

---

## 🎯 Récapitulatif

```
✅ Supabase setup        - 5 min
✅ GitHub repo          - 5 min  
✅ Netlify deploy       - 5 min
✅ Tests & vérif        - 5 min
━━━━━━━━━━━━━━━━━━━━━
   TOTAL: 20 minutes
```

Votre app est maintenant en ligne! 🚀

---

**Support:**
- Netlify Docs: https://docs.netlify.com
- Supabase Docs: https://supabase.com/docs
- GitHub Help: https://docs.github.com
