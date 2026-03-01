#!/bin/bash
# Script de setup pour Netlify + Supabase

echo "=========================================="
echo "MLC Gestion des Membres - Setup Script"
echo "=========================================="
echo ""

# Étape 1: Installation des dépendances
echo "Step 1: Installation des dépendances npm..."
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de npm install"
    exit 1
fi
echo "✅ Dépendances installées"
echo ""

# Étape 2: Build frontend
echo "Step 2: Construction du frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi
echo "✅ Frontend built"
echo ""

# Étape 3: Information utilisateur
echo "=========================================="
echo "✅ SETUP COMPLETE!"
echo "=========================================="
echo ""
echo "Prochaines étapes:"
echo ""
echo "1. Créez un compte Supabase: https://app.supabase.com"
echo "2. Créez une nouvelle base de données"
echo "3. Récupérez vos API keys (Project URL & Anon Key)"
echo ""
echo "4. Poussez votre code vers GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for Netlify deployment'"
echo "   git push origin main"
echo ""
echo "5. Connectez GitHub à Netlify:"
echo "   https://app.netlify.com → Add new site → Connect GitHub"
echo ""
echo "6. Configurez les variables d'environnement dans Netlify:"
echo "   Site settings → Build & deploy → Environment"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo ""
echo "7. Triggez un deploy sur Netlify (ou attendez le prochain git push)"
echo ""
echo "📖 Guide complet: GUIDE_DEPLOYMENT_NETLIFY_SUPABASE.md"
echo ""
