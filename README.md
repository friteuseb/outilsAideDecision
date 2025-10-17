# 🎯 Outils d'Aide à la Décision

Plateforme SaaS multi-clients de priorisation de backlog avec interface white-label.

## ✨ Fonctionnalités

- **Multi-tenant** : Gérez plusieurs clients avec isolation complète des données
- **White-label** : Personnalisation visuelle par client (logo, couleurs)
- **Priorisation intelligente** : Système de scoring configurable (Impact Business, Complexité, Budget)
- **Templates réutilisables** : Bibliothèque de projets types par secteur
- **Gestion de roadmap** : Sélection de projets avec suivi budgétaire
- **Export de données** : CSV pour analyse et partage
- **Interface moderne** : Next.js 14, React, Tailwind CSS

## 🏗️ Stack Technique

- **Frontend** : Next.js 14 (App Router), React 19, TypeScript
- **Backend** : Next.js API Routes
- **Base de données** : PostgreSQL via Prisma ORM
- **Auth** : Supabase Auth (à configurer)
- **UI** : Tailwind CSS, Lucide Icons
- **Hosting** : Vercel (recommandé)

## 📋 Prérequis

- Node.js 20+ et npm
- PostgreSQL 14+ (ou utiliser Supabase)
- Git

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone git@github.com:friteuseb/outilsAideDecision.git
cd outilsAideDecision
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer la base de données

#### Option A : Utiliser Supabase (recommandé)

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Récupérez :
   - `DATABASE_URL` : Settings > Database > Connection string (mode "Session")
   - `NEXT_PUBLIC_SUPABASE_URL` : Settings > API > Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Settings > API > anon public

#### Option B : PostgreSQL local

```bash
# Créer une base de données
createdb backlog_tool

# L'URL sera :
# postgresql://username:password@localhost:5432/backlog_tool
```

### 4. Configurer les variables d'environnement

Créez un fichier `.env` à la racine :

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/backlog_tool?schema=public"

# Supabase (si utilisé)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 5. Initialiser la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Créer les tables
npm run db:push

# Peupler avec des données d'exemple
npm run db:seed
```

### 6. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📊 Données de démo

Après le seed, vous aurez accès à :

**Clients créés :**
- **Acme E-commerce** (slug: `acme`) - Avec 5 projets e-commerce
- **Demo Corp** (slug: `demo`) - Avec 2 projets basiques

**Utilisateurs créés :**
- `admin@outilsdecision.fr` - Super Admin
- `admin@acme.fr` - Admin Acme
- `demo@demo.com` - Admin Demo

**Templates** : 10 templates réutilisables (SEO, Cross-selling, Checkout, etc.)

## 📖 Utilisation

### Page d'accueil

- Liste tous les clients avec statistiques
- Accès rapide au backlog de chaque client
- Lien vers l'administration

### Interface de priorisation (`/clients/[slug]`)

1. **Visualisation** : Tous les projets triés par score de priorité
2. **Pondération** : Ajustez les poids des critères (Impact, Complexité, Budget)
3. **Édition** : Modifiez les scores directement dans le tableau
4. **Sélection** : Cochez les projets pour composer votre roadmap
5. **Suivi budgétaire** : Visualisation en temps réel du budget consommé
6. **Export** : Téléchargez votre sélection en CSV

### Panneau d'administration (à développer)

- Gestion des clients (CRUD)
- Gestion des utilisateurs et rôles
- Configuration des templates
- Analytics globales

## 🎨 Personnalisation White-label

Chaque client peut avoir :
- **Logo personnalisé** : Affiché dans l'header
- **Couleurs** : Couleur primaire et secondaire
- **Domaine custom** : ex: backlog.client.com
- **Critères de scoring** : Définir des critères personnalisés

Configuration dans la table `Client` :
```json
{
  "couleurPrimaire": "#E63946",
  "couleurSecondaire": "#1D3557",
  "logo": "https://exemple.com/logo.png",
  "criteresScoring": {
    "impactBusiness": {
      "label": "Impact Business",
      "description": "...",
      "weight": 50
    }
  }
}
```

## 🔧 Scripts disponibles

```bash
npm run dev          # Lancer en développement
npm run build        # Build pour production
npm run start        # Lancer en production
npm run lint         # Vérifier le code

npm run db:generate  # Générer le client Prisma
npm run db:push      # Pousser les changements de schéma
npm run db:seed      # Peupler la base de données
npm run db:studio    # Ouvrir Prisma Studio (GUI)
```

## 📁 Structure du projet

```
/app
  /api                 # API Routes Next.js
    /clients           # CRUD clients
  /clients/[slug]      # Interface de priorisation par client
  page.tsx             # Page d'accueil
/lib
  prisma.ts            # Client Prisma
  supabase.ts          # Client Supabase
  utils.ts             # Utilitaires
/prisma
  schema.prisma        # Schéma de base de données
  seed.ts              # Script de seed
/types
  index.ts             # Types TypeScript
```

## 🗄️ Modèle de données

### Entités principales

- **Client** : Organisation/client (tenant)
- **User** : Utilisateur avec rôle (SUPER_ADMIN, ADMIN, EDITOR, VIEWER)
- **Project** : Projet dans un backlog
- **Template** : Template de projet réutilisable
- **Roadmap** : Roadmap avec sélection de projets

### Relations

- Un Client a plusieurs Users et Projects
- Un Project appartient à un Client et peut être basé sur un Template
- Une Roadmap contient plusieurs Projects

## 🚢 Déploiement sur Vercel

1. Push votre code sur GitHub
2. Connectez votre repo sur [vercel.com](https://vercel.com)
3. Configurez les variables d'environnement
4. Déployez !

Vercel détectera automatiquement Next.js et configurera tout.

## 🔐 Authentification (à finaliser)

L'authentification Supabase est prête mais pas encore activée. Pour l'activer :

1. Configurez Supabase Auth dans votre projet
2. Créez les middleware de protection de routes
3. Ajoutez les pages de login/signup
4. Liez les utilisateurs Supabase aux utilisateurs Prisma via `supabaseId`

## 📈 Prochaines étapes (Roadmap)

- [ ] **Authentification complète** : Login, signup, password reset
- [ ] **Backoffice admin** : CRUD complet pour clients/users/templates
- [ ] **Roadmap visuelle** : Timeline/Gantt pour visualiser la planification
- [ ] **Rapports PDF/PPT** : Génération automatique de présentations
- [ ] **Collaboration temps réel** : WebSockets pour édition simultanée
- [ ] **Notifications** : Emails et in-app notifications
- [ ] **API publique** : REST API pour intégrations externes
- [ ] **Mobile responsive** : Optimisation pour mobile/tablette

## 🤝 Support

Pour toute question ou problème :
1. Ouvrez une issue sur GitHub
2. Consultez la documentation Prisma/Next.js
3. Contactez le développeur

## 📄 Licence

Propriétaire - Tous droits réservés

---

**Développé avec ❤️ par Cyril Talan**
Powered by Next.js, Prisma, Supabase
