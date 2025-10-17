# Guide de déploiement sur Vercel

## Étapes de configuration

### 1. Configuration de la base de données Supabase

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Allez dans **Settings > Database**
4. Copiez la **Connection String** en mode **Session**
5. Remplacez `[YOUR-PASSWORD]` par votre mot de passe

### 2. Configuration des variables d'environnement sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. Allez dans **Settings > Environment Variables**
4. Ajoutez les variables suivantes :

```
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres

NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[VOTRE-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[VOTRE-SERVICE-ROLE-KEY]

NEXT_PUBLIC_APP_URL=https://votre-app.vercel.app
NODE_ENV=production
```

### 3. Initialiser la base de données

Depuis votre machine locale :

```bash
# 1. Configurer le .env avec la DATABASE_URL de production
DATABASE_URL="votre-url-supabase"

# 2. Générer Prisma
npm run db:generate

# 3. Créer les tables
npm run db:push

# 4. Peupler avec les données de démo
npm run db:seed
```

### 4. Redéployer sur Vercel

Une fois les variables configurées :

1. Retournez sur Vercel
2. Allez dans **Deployments**
3. Cliquez sur **Redeploy** sur le dernier déploiement
4. Cochez **Use existing Build Cache** (décoché)
5. Cliquez sur **Redeploy**

### 5. Vérification

Une fois déployé :
- Visitez votre URL Vercel
- Vous devriez voir la page d'accueil avec les 2 clients de démo
- Cliquez sur "Acme E-commerce" pour tester l'interface de priorisation

## Problèmes courants

### Error: DATABASE_URL not found
- Vérifiez que la variable `DATABASE_URL` est bien configurée dans Vercel
- Vérifiez que vous avez bien redéployé après l'ajout des variables

### Images ne s'affichent pas
- Les images externes sont maintenant configurées dans `next.config.ts`
- Si un client a un logo externe, assurez-vous que l'URL est accessible

### Application error: a client-side exception
- Vérifiez la console du navigateur pour l'erreur exacte
- Vérifiez que la base de données est bien initialisée
- Vérifiez que toutes les variables d'environnement sont présentes

## Alternative : Utiliser Vercel Postgres

Si vous préférez ne pas utiliser Supabase :

1. Sur Vercel, allez dans **Storage**
2. Créez une nouvelle base **Postgres**
3. Vercel va automatiquement créer les variables d'environnement
4. Suivez les étapes 3-5 ci-dessus pour initialiser la DB
