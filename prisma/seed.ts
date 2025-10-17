import { PrismaClient, UserRole, TemplateSecteur } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Créer des templates réutilisables
  console.log('Creating templates...')

  const templates = await Promise.all([
    // Templates E-commerce
    prisma.template.create({
      data: {
        titre: '[SEO - Gaps] Création pages listes de produits',
        categorie: 'Contenu SEO',
        secteur: TemplateSecteur.ECOMMERCE,
        description: 'Création de pages catégories virtuelles avec ElasticSuite pour combler les gaps SEO et améliorer le positionnement organique',
        budgetMoyen: 10000,
        delaiMoyen: 2,
        scoresDefaults: {
          impactBusiness: 9,
          complexite: 2
        },
        kpiSuggeres: ['Trafic SEO', 'Positions organiques', 'Pages indexées']
      }
    }),
    prisma.template.create({
      data: {
        titre: 'Cross-Selling & Recommandations personnalisées',
        categorie: 'Conversion',
        secteur: TemplateSecteur.ECOMMERCE,
        description: 'Mise en place d\'un système de recommandations produits intelligent basé sur l\'IA pour augmenter le panier moyen',
        budgetMoyen: 7000,
        delaiMoyen: 1,
        scoresDefaults: {
          impactBusiness: 9,
          complexite: 4
        },
        kpiSuggeres: ['Panier moyen', 'Taux de conversion', 'CA par visite']
      }
    }),
    prisma.template.create({
      data: {
        titre: 'Optimisation du Checkout',
        categorie: 'Conversion',
        secteur: TemplateSecteur.ECOMMERCE,
        description: 'Refonte du tunnel de commande pour réduire l\'abandon panier et améliorer le taux de conversion',
        budgetMoyen: 15000,
        delaiMoyen: 3,
        scoresDefaults: {
          impactBusiness: 10,
          complexite: 6
        },
        kpiSuggeres: ['Taux d\'abandon', 'Taux de conversion', 'Commandes']
      }
    }),
    prisma.template.create({
      data: {
        titre: 'Gestion des stocks temps réel',
        categorie: 'Logistique',
        secteur: TemplateSecteur.ECOMMERCE,
        description: 'Intégration API avec système de gestion des stocks pour affichage en temps réel de la disponibilité produits',
        budgetMoyen: 4000,
        delaiMoyen: 1,
        scoresDefaults: {
          impactBusiness: 7,
          complexite: 3
        },
        kpiSuggeres: ['Satisfaction client', 'Retours produits', 'Fiabilité stock']
      }
    }),
    prisma.template.create({
      data: {
        titre: 'Module Carte Cadeau',
        categorie: 'Conversion',
        secteur: TemplateSecteur.ECOMMERCE,
        description: 'Mise en place d\'un système de cartes cadeaux digitales avec personnalisation et envoi automatique',
        budgetMoyen: 4000,
        delaiMoyen: 1,
        scoresDefaults: {
          impactBusiness: 8,
          complexite: 2
        },
        kpiSuggeres: ['CA cartes cadeaux', 'Nouveaux clients', 'Panier moyen']
      }
    }),

    // Templates Marketing
    prisma.template.create({
      data: {
        titre: 'Programme de fidélité',
        categorie: 'Fidélisation',
        secteur: TemplateSecteur.MARKETING,
        description: 'Création d\'un programme de points de fidélité avec gamification pour augmenter la rétention client',
        budgetMoyen: 12000,
        delaiMoyen: 4,
        scoresDefaults: {
          impactBusiness: 8,
          complexite: 5
        },
        kpiSuggeres: ['Taux de rétention', 'Fréquence d\'achat', 'LTV client']
      }
    }),
    prisma.template.create({
      data: {
        titre: 'Campagnes email automatisées',
        categorie: 'Marketing automation',
        secteur: TemplateSecteur.MARKETING,
        description: 'Setup de scénarios d\'emails automatisés (panier abandonné, relance, upsell) pour maximiser le CA',
        budgetMoyen: 5000,
        delaiMoyen: 2,
        scoresDefaults: {
          impactBusiness: 7,
          complexite: 3
        },
        kpiSuggeres: ['Taux d\'ouverture', 'Taux de clic', 'CA généré']
      }
    }),

    // Templates IT/Performance
    prisma.template.create({
      data: {
        titre: 'Optimisation performances site',
        categorie: 'Performance',
        secteur: TemplateSecteur.IT,
        description: 'Audit et optimisation des performances web (Core Web Vitals, temps de chargement, cache)',
        budgetMoyen: 8000,
        delaiMoyen: 2,
        scoresDefaults: {
          impactBusiness: 7,
          complexite: 4
        },
        kpiSuggeres: ['Page Speed Score', 'Temps de chargement', 'Taux de rebond']
      }
    }),
    prisma.template.create({
      data: {
        titre: 'Migration technique',
        categorie: 'Infrastructure',
        secteur: TemplateSecteur.IT,
        description: 'Migration vers nouvelle infrastructure/plateforme avec plan de recette et rollback',
        budgetMoyen: 25000,
        delaiMoyen: 8,
        scoresDefaults: {
          impactBusiness: 6,
          complexite: 9
        },
        kpiSuggeres: ['Uptime', 'Performance', 'Coûts infrastructure']
      }
    }),

    // Templates UX/Accessibilité
    prisma.template.create({
      data: {
        titre: 'Amélioration accessibilité (RGAA)',
        categorie: 'Accessibilité',
        secteur: TemplateSecteur.ECOMMERCE,
        description: 'Mise en conformité du site avec les standards d\'accessibilité RGAA/WCAG pour élargir l\'audience',
        budgetMoyen: 30000,
        delaiMoyen: 12,
        scoresDefaults: {
          impactBusiness: 5,
          complexite: 8
        },
        kpiSuggeres: ['Score accessibilité', 'Audience touchée', 'Conformité légale']
      }
    }),
  ])

  console.log(`✅ Created ${templates.length} templates`)

  // 2. Créer des clients (tenants)
  console.log('Creating clients...')

  const clientEcommerce = await prisma.client.create({
    data: {
      nom: 'Acme E-commerce',
      slug: 'acme',
      logo: null,
      couleurPrimaire: '#E63946',
      couleurSecondaire: '#1D3557',
      statut: 'ACTIF',
      criteresScoring: {
        impactBusiness: {
          label: 'Impact Business',
          description: 'Potentiel CA, croissance, acquisition clients',
          weight: 50
        },
        complexite: {
          label: 'Complexité',
          description: 'Complexité technique + gestion du changement',
          weight: 25
        },
        budgetScore: {
          label: 'Budget',
          description: 'Score inversé : budget faible = meilleur score',
          weight: 25
        }
      }
    }
  })

  const clientDemo = await prisma.client.create({
    data: {
      nom: 'Demo Corp',
      slug: 'demo',
      couleurPrimaire: '#3B82F6',
      couleurSecondaire: '#1E40AF',
      statut: 'ACTIF'
    }
  })

  console.log(`✅ Created 2 clients`)

  // 3. Créer des utilisateurs
  console.log('Creating users...')

  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@outilsdecision.fr',
      nom: 'Admin',
      prenom: 'Super',
      role: UserRole.SUPER_ADMIN,
      clientId: clientEcommerce.id,
      supabaseId: 'super-admin-id' // À remplacer par l'ID Supabase réel
    }
  })

  const adminAcme = await prisma.user.create({
    data: {
      email: 'admin@acme.fr',
      nom: 'Martin',
      prenom: 'Jean',
      role: UserRole.ADMIN,
      clientId: clientEcommerce.id,
      supabaseId: 'admin-acme-id'
    }
  })

  const editorAcme = await prisma.user.create({
    data: {
      email: 'editor@acme.fr',
      nom: 'Dupont',
      prenom: 'Marie',
      role: UserRole.EDITOR,
      clientId: clientEcommerce.id,
      supabaseId: 'editor-acme-id'
    }
  })

  const adminDemo = await prisma.user.create({
    data: {
      email: 'demo@demo.com',
      nom: 'Demo',
      prenom: 'User',
      role: UserRole.ADMIN,
      clientId: clientDemo.id,
      supabaseId: 'admin-demo-id'
    }
  })

  console.log(`✅ Created 4 users`)

  // 4. Créer quelques projets pour Acme E-commerce (depuis les templates)
  console.log('Creating projects for Acme E-commerce...')

  const seoGapsTemplate = templates.find(t => t.titre.includes('SEO - Gaps'))
  const crossSellingTemplate = templates.find(t => t.titre.includes('Cross-Selling'))
  const checkoutTemplate = templates.find(t => t.titre.includes('Checkout'))
  const stockTemplate = templates.find(t => t.titre.includes('stocks'))
  const carteTemplate = templates.find(t => t.titre.includes('Carte Cadeau'))

  await prisma.project.createMany({
    data: [
      {
        clientId: clientEcommerce.id,
        titre: '[SEO - Gaps] Création pages listes de produits',
        categorie: 'Contenu SEO - Gaps',
        description: 'Avec ElasticSuite, création de catégories virtuelles pour combler les gaps SEO identifiés dans l\'analyse. Aucun développement nécessaire, juste de la configuration.',
        budget: 10000,
        delaiSemaines: 2,
        kpi: 'Trafic SEO',
        scores: {
          impactBusiness: 9,
          complexite: 2,
          budgetScore: 8
        },
        additionalInfo: 'ElasticSuite permet de créer des catégories sans développement. Configuration uniquement.',
        statut: 'BACKLOG',
        templateId: seoGapsTemplate?.id,
        createdById: adminAcme.id
      },
      {
        clientId: clientEcommerce.id,
        titre: 'Cross-Selling intelligent',
        categorie: 'Conversion',
        description: 'Système de recommandations produits basé sur l\'IA pour augmenter le panier moyen et améliorer l\'expérience client.',
        budget: 7000,
        delaiSemaines: 1,
        kpi: 'Panier moyen',
        scores: {
          impactBusiness: 9,
          complexite: 4,
          budgetScore: 7
        },
        additionalInfo: 'Étude IA nécessaire pour déterminer les meilleurs algorithmes de recommandation.',
        statut: 'BACKLOG',
        templateId: crossSellingTemplate?.id,
        createdById: adminAcme.id
      },
      {
        clientId: clientEcommerce.id,
        titre: 'Optimisation Checkout',
        categorie: 'Conversion',
        description: 'Refonte du tunnel de commande pour réduire les frictions et augmenter le taux de conversion.',
        budget: 15000,
        delaiSemaines: 3,
        kpi: 'Taux de conversion',
        scores: {
          impactBusiness: 10,
          complexite: 6,
          budgetScore: 6
        },
        additionalInfo: 'Checkout optimisé nécessite adaptation thème. ROI élevé attendu.',
        statut: 'BACKLOG',
        templateId: checkoutTemplate?.id,
        createdById: adminAcme.id
      },
      {
        clientId: clientEcommerce.id,
        titre: 'Affichage stocks temps réel',
        categorie: 'Logistique',
        description: 'Intégration API pour afficher la disponibilité produits en temps réel sur le site.',
        budget: 4000,
        delaiSemaines: 1,
        kpi: 'Satisfaction client',
        scores: {
          impactBusiness: 7,
          complexite: 3,
          budgetScore: 9
        },
        additionalInfo: 'API logistique à intégrer. 4 jours de développement estimés.',
        statut: 'BACKLOG',
        templateId: stockTemplate?.id,
        createdById: adminAcme.id
      },
      {
        clientId: clientEcommerce.id,
        titre: 'Module Carte Cadeau digitale',
        categorie: 'Conversion',
        description: 'Mise en place de cartes cadeaux numériques.',
        budget: 4000,
        delaiSemaines: 1,
        kpi: 'CA Cartes cadeaux',
        scores: {
          impactBusiness: 8,
          complexite: 2,
          budgetScore: 9
        },
        additionalInfo: 'Module carte cadeau. Installation 2j + adaptation thème 1-2j.',
        statut: 'BACKLOG',
        templateId: carteTemplate?.id,
        createdById: adminAcme.id
      }
    ]
  })

  console.log(`✅ Created 5 projects for Acme E-commerce`)

  // 5. Créer quelques projets pour Demo
  await prisma.project.createMany({
    data: [
      {
        clientId: clientDemo.id,
        titre: 'Refonte UX Homepage',
        categorie: 'UX Design',
        description: 'Amélioration de l\'expérience utilisateur sur la page d\'accueil pour augmenter l\'engagement.',
        budget: 8000,
        delaiSemaines: 3,
        kpi: 'Taux d\'engagement',
        scores: {
          impactBusiness: 6,
          complexite: 4,
          budgetScore: 7
        },
        statut: 'BACKLOG',
        createdById: adminDemo.id
      },
      {
        clientId: clientDemo.id,
        titre: 'Module blog & contenus',
        categorie: 'Content Marketing',
        description: 'Création d\'un blog avec CMS pour améliorer le référencement naturel et l\'engagement.',
        budget: 12000,
        delaiSemaines: 4,
        kpi: 'Trafic organique',
        scores: {
          impactBusiness: 7,
          complexite: 5,
          budgetScore: 6
        },
        statut: 'BACKLOG',
        createdById: adminDemo.id
      }
    ]
  })

  console.log(`✅ Created 2 projects for Demo`)

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
