-- ============================================
-- SCHEMA CREATION FOR SUPABASE
-- ============================================

-- CreateEnum
CREATE TYPE "ClientStatut" AS ENUM ('ACTIF', 'SUSPENDU', 'ARCHIVE');
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER');
CREATE TYPE "TemplateSecteur" AS ENUM ('ECOMMERCE', 'B2B', 'RETAIL', 'MANUFACTURING', 'SERVICES', 'MARKETING', 'IT', 'AUTRE');
CREATE TYPE "ProjectStatut" AS ENUM ('BACKLOG', 'EN_COURS', 'TERMINE', 'ARCHIVE', 'ANNULE');

-- CreateTable Client
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "couleurPrimaire" TEXT NOT NULL DEFAULT '#3B82F6',
    "couleurSecondaire" TEXT NOT NULL DEFAULT '#1E40AF',
    "domaine" TEXT,
    "criteresScoring" JSONB NOT NULL DEFAULT '{"impactBusiness": {"label": "Impact Business", "description": "Potentiel CA, croissance", "weight": 50}, "complexite": {"label": "Complexité", "description": "Complexité technique et organisationnelle", "weight": 25}, "budgetScore": {"label": "Budget", "description": "Score basé sur le budget", "weight": 25}}',
    "statut" "ClientStatut" NOT NULL DEFAULT 'ACTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT,
    "avatar" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "clientId" TEXT NOT NULL,
    "supabaseId" TEXT,
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable Template
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "secteur" "TemplateSecteur" NOT NULL,
    "description" TEXT NOT NULL,
    "budgetMoyen" INTEGER,
    "delaiMoyen" INTEGER,
    "scoresDefaults" JSONB NOT NULL DEFAULT '{"impactBusiness": 5, "complexite": 5}',
    "kpiSuggeres" TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable Project
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "delaiSemaines" INTEGER NOT NULL,
    "kpi" TEXT NOT NULL,
    "scores" JSONB NOT NULL DEFAULT '{"impactBusiness": 5, "complexite": 5, "budgetScore": 5}',
    "additionalInfo" TEXT,
    "statut" "ProjectStatut" NOT NULL DEFAULT 'BACKLOG',
    "templateId" TEXT,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable Roadmap
CREATE TABLE "Roadmap" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "clientId" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "budgetTotal" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable RoadmapProject
CREATE TABLE "RoadmapProject" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL,
    "dateDebutPrevue" TIMESTAMP(3),
    "dateFinPrevue" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RoadmapProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_slug_key" ON "Client"("slug");
CREATE INDEX "Client_slug_idx" ON "Client"("slug");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_supabaseId_key" ON "User"("supabaseId");
CREATE INDEX "User_clientId_idx" ON "User"("clientId");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_supabaseId_idx" ON "User"("supabaseId");
CREATE INDEX "Template_secteur_idx" ON "Template"("secteur");
CREATE INDEX "Project_clientId_idx" ON "Project"("clientId");
CREATE INDEX "Project_statut_idx" ON "Project"("statut");
CREATE INDEX "Project_templateId_idx" ON "Project"("templateId");
CREATE INDEX "Roadmap_clientId_idx" ON "Roadmap"("clientId");
CREATE INDEX "RoadmapProject_roadmapId_idx" ON "RoadmapProject"("roadmapId");
CREATE INDEX "RoadmapProject_projectId_idx" ON "RoadmapProject"("projectId");
CREATE UNIQUE INDEX "RoadmapProject_roadmapId_projectId_key" ON "RoadmapProject"("roadmapId", "projectId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Project" ADD CONSTRAINT "Project_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Project" ADD CONSTRAINT "Project_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RoadmapProject" ADD CONSTRAINT "RoadmapProject_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RoadmapProject" ADD CONSTRAINT "RoadmapProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================
-- SEED DATA
-- ============================================

-- Insert Templates
INSERT INTO "Template" ("id", "titre", "categorie", "secteur", "description", "budgetMoyen", "delaiMoyen", "scoresDefaults", "kpiSuggeres", "isPublic", "createdAt", "updatedAt") VALUES
('tpl_seo_gaps', '[SEO - Gaps] Création pages listes de produits', 'Contenu SEO', 'ECOMMERCE', 'Création de pages catégories virtuelles avec ElasticSuite pour combler les gaps SEO et améliorer le positionnement organique', 10000, 2, '{"impactBusiness": 9, "complexite": 2}', ARRAY['Trafic SEO', 'Positions organiques', 'Pages indexées'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tpl_cross_selling', 'Cross-Selling & Recommandations personnalisées', 'Conversion', 'ECOMMERCE', 'Mise en place d''un système de recommandations produits intelligent basé sur l''IA pour augmenter le panier moyen', 7000, 1, '{"impactBusiness": 9, "complexite": 4}', ARRAY['Panier moyen', 'Taux de conversion', 'CA par visite'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tpl_checkout', 'Optimisation du Checkout', 'Conversion', 'ECOMMERCE', 'Refonte du tunnel de commande pour réduire l''abandon panier et améliorer le taux de conversion', 15000, 3, '{"impactBusiness": 10, "complexite": 6}', ARRAY['Taux d''abandon', 'Taux de conversion', 'Commandes'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tpl_stock', 'Gestion des stocks temps réel', 'Logistique', 'ECOMMERCE', 'Intégration API avec système de gestion des stocks pour affichage en temps réel de la disponibilité produits', 4000, 1, '{"impactBusiness": 7, "complexite": 3}', ARRAY['Satisfaction client', 'Retours produits', 'Fiabilité stock'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tpl_carte_cadeau', 'Module Carte Cadeau', 'Conversion', 'ECOMMERCE', 'Mise en place d''un système de cartes cadeaux digitales avec personnalisation et envoi automatique', 4000, 1, '{"impactBusiness": 8, "complexite": 2}', ARRAY['CA cartes cadeaux', 'Nouveaux clients', 'Panier moyen'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tpl_fidelite', 'Programme de fidélité', 'Fidélisation', 'MARKETING', 'Création d''un programme de points de fidélité avec gamification pour augmenter la rétention client', 12000, 4, '{"impactBusiness": 8, "complexite": 5}', ARRAY['Taux de rétention', 'Fréquence d''achat', 'LTV client'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tpl_email_auto', 'Campagnes email automatisées', 'Marketing automation', 'MARKETING', 'Setup de scénarios d''emails automatisés (panier abandonné, relance, upsell) pour maximiser le CA', 5000, 2, '{"impactBusiness": 7, "complexite": 3}', ARRAY['Taux d''ouverture', 'Taux de clic', 'CA généré'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tpl_perf', 'Optimisation performances site', 'Performance', 'IT', 'Audit et optimisation des performances web (Core Web Vitals, temps de chargement, cache)', 8000, 2, '{"impactBusiness": 7, "complexite": 4}', ARRAY['Page Speed Score', 'Temps de chargement', 'Taux de rebond'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tpl_migration', 'Migration technique', 'Infrastructure', 'IT', 'Migration vers nouvelle infrastructure/plateforme avec plan de recette et rollback', 25000, 8, '{"impactBusiness": 6, "complexite": 9}', ARRAY['Uptime', 'Performance', 'Coûts infrastructure'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tpl_accessibilite', 'Amélioration accessibilité (RGAA)', 'Accessibilité', 'ECOMMERCE', 'Mise en conformité du site avec les standards d''accessibilité RGAA/WCAG pour élargir l''audience', 30000, 12, '{"impactBusiness": 5, "complexite": 8}', ARRAY['Score accessibilité', 'Audience touchée', 'Conformité légale'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Clients
INSERT INTO "Client" ("id", "nom", "slug", "logo", "couleurPrimaire", "couleurSecondaire", "statut", "criteresScoring", "createdAt", "updatedAt") VALUES
('client_acme', 'Acme E-commerce', 'acme', NULL, '#E63946', '#1D3557', 'ACTIF', '{"impactBusiness": {"label": "Impact Business", "description": "Potentiel CA, croissance, acquisition clients", "weight": 50}, "complexite": {"label": "Complexité", "description": "Complexité technique + gestion du changement", "weight": 25}, "budgetScore": {"label": "Budget", "description": "Score inversé : budget faible = meilleur score", "weight": 25}}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('client_demo', 'Demo Corp', 'demo', NULL, '#3B82F6', '#1E40AF', 'ACTIF', '{"impactBusiness": {"label": "Impact Business", "description": "Potentiel CA, croissance", "weight": 50}, "complexite": {"label": "Complexité", "description": "Complexité technique et organisationnelle", "weight": 25}, "budgetScore": {"label": "Budget", "description": "Score basé sur le budget", "weight": 25}}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Users
INSERT INTO "User" ("id", "email", "nom", "prenom", "role", "clientId", "supabaseId", "createdAt", "updatedAt") VALUES
('user_super_admin', 'admin@outilsdecision.fr', 'Admin', 'Super', 'SUPER_ADMIN', 'client_acme', 'super-admin-id', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user_admin_acme', 'admin@acme.fr', 'Martin', 'Jean', 'ADMIN', 'client_acme', 'admin-acme-id', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user_editor_acme', 'editor@acme.fr', 'Dupont', 'Marie', 'EDITOR', 'client_acme', 'editor-acme-id', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user_admin_demo', 'demo@demo.com', 'Demo', 'User', 'ADMIN', 'client_demo', 'admin-demo-id', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Projects for Acme E-commerce
INSERT INTO "Project" ("id", "clientId", "titre", "categorie", "description", "budget", "delaiSemaines", "kpi", "scores", "additionalInfo", "statut", "templateId", "createdById", "createdAt", "updatedAt") VALUES
('proj_acme_1', 'client_acme', '[SEO - Gaps] Création pages listes de produits', 'Contenu SEO - Gaps', 'Avec ElasticSuite, création de catégories virtuelles pour combler les gaps SEO identifiés dans l''analyse. Aucun développement nécessaire, juste de la configuration.', 10000, 2, 'Trafic SEO', '{"impactBusiness": 9, "complexite": 2, "budgetScore": 8}', 'ElasticSuite permet de créer des catégories sans développement. Configuration uniquement.', 'BACKLOG', 'tpl_seo_gaps', 'user_admin_acme', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('proj_acme_2', 'client_acme', 'Cross-Selling intelligent', 'Conversion', 'Système de recommandations produits basé sur l''IA pour augmenter le panier moyen et améliorer l''expérience client.', 7000, 1, 'Panier moyen', '{"impactBusiness": 9, "complexite": 4, "budgetScore": 7}', 'Étude IA nécessaire pour déterminer les meilleurs algorithmes de recommandation.', 'BACKLOG', 'tpl_cross_selling', 'user_admin_acme', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('proj_acme_3', 'client_acme', 'Optimisation Checkout', 'Conversion', 'Refonte du tunnel de commande pour réduire les frictions et augmenter le taux de conversion.', 15000, 3, 'Taux de conversion', '{"impactBusiness": 10, "complexite": 6, "budgetScore": 6}', 'Checkout optimisé nécessite adaptation thème. ROI élevé attendu.', 'BACKLOG', 'tpl_checkout', 'user_admin_acme', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('proj_acme_4', 'client_acme', 'Affichage stocks temps réel', 'Logistique', 'Intégration API pour afficher la disponibilité produits en temps réel sur le site.', 4000, 1, 'Satisfaction client', '{"impactBusiness": 7, "complexite": 3, "budgetScore": 9}', 'API logistique à intégrer. 4 jours de développement estimés.', 'BACKLOG', 'tpl_stock', 'user_admin_acme', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('proj_acme_5', 'client_acme', 'Module Carte Cadeau digitale', 'Conversion', 'Mise en place de cartes cadeaux numériques.', 4000, 1, 'CA Cartes cadeaux', '{"impactBusiness": 8, "complexite": 2, "budgetScore": 9}', 'Module carte cadeau. Installation 2j + adaptation thème 1-2j.', 'BACKLOG', 'tpl_carte_cadeau', 'user_admin_acme', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Projects for Demo Corp
INSERT INTO "Project" ("id", "clientId", "titre", "categorie", "description", "budget", "delaiSemaines", "kpi", "scores", "statut", "createdById", "createdAt", "updatedAt") VALUES
('proj_demo_1', 'client_demo', 'Refonte UX Homepage', 'UX Design', 'Amélioration de l''expérience utilisateur sur la page d''accueil pour augmenter l''engagement.', 8000, 3, 'Taux d''engagement', '{"impactBusiness": 6, "complexite": 4, "budgetScore": 7}', 'BACKLOG', 'user_admin_demo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('proj_demo_2', 'client_demo', 'Module blog & contenus', 'Content Marketing', 'Création d''un blog avec CMS pour améliorer le référencement naturel et l''engagement.', 12000, 4, 'Trafic organique', '{"impactBusiness": 7, "complexite": 5, "budgetScore": 6}', 'BACKLOG', 'user_admin_demo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
