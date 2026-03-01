# 🔧 FIX: Synchronisation Supabase + Netlify

## 🐛 Problème Identifié

La Netlify Function `netlify/functions/members.js` utilisait les **mauvaises variables d'environnement**:
- ❌ `process.env.VITE_SUPABASE_URL` 
- ❌ `process.env.VITE_SUPABASE_ANON_KEY`

**Pourquoi c'est un problème:**
- `VITE_` = variables pour le **frontend** (Vite build)
- Netlify Functions = **backend** (serverless)
- Résultat: supabaseUrl et supabaseAnonKey étaient `undefined` → pas de connexion à Supabase!

## ✅ Solution Appliquée

**Fichier corrigé:** `netlify/functions/members.js`

```javascript
// ❌ AVANT (Incorrect)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// ✅ APRÈS (Correct)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
```

## 🚀 Action Requise: Configurer Netlify

Vous devez ajouter les variables d'environnement dans **Netlify Dashboard**:

### Étapes:

1. **Aller à:** https://app.netlify.com
2. **Sélectionner le site:** `mlc-gestion-membres`
3. **Navigate to:** `Site settings` → `Build & deploy` → `Environment`
4. **Ajouter 2 variables:**

| Nom | Valeur |
|-----|--------|
| `SUPABASE_URL` | `https://almfbcecvasacqorvcsj.supabase.co` |
| `SUPABASE_ANON_KEY` | `sb_publishable_a5aGXZnf1t6kSNkb86gBwg_m9WyRsFZ` |

5. **Déclencher un redéploiement:** `Deploys` → `Trigger deploy`

## ✨ Résultat Attendu

Après configuration et redéploiement:
- ✅ Netlify Function peut se connecter à Supabase
- ✅ L'application peut enregistrer des membres
- ✅ L'application peut récupérer les données
- ✅ Les données sont synchronisées dans Supabase

## 📋 Diagramme du Flow

```
Frontend (React)
    ↓
    fetch('/.netlify/functions/members')
    ↓
Netlify Function (members.js)
    ↓
    createClient(SUPABASE_URL, SUPABASE_ANON_KEY) ← Nécessite ces variables!
    ↓
Supabase Database
```

## ⚠️ Important

Ne configure **JAMAIS** dans `.env`:
- Ces variables frontend/backend doivent être dans Netlify Dashboard
- Les vraies clés ne doivent jamais être committées dans git
- Utiliser uniquement `.env.local` en local (ignité par git)

## 🔄 Historique

- **Problème découvert:** Supabase ne synchronise pas avec Netlify
- **Cause:** Variables d'environnement incorrectes (`VITE_*` au lieu de préfixes appropriés)
- **Fix appliqué:** `netlify/functions/members.js` corrigé
- **Prochaine étape:** Setter les variables dans Netlify Dashboard
