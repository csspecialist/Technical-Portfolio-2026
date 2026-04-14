// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import vercel from '@astrojs/vercel';
import { loadEnv } from "vite";

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/': '/en/',
  },
  output: 'server',
  adapter: vercel(),
  integrations: [
    starlight({
      title: 'Technical Documentation Lab',
      defaultLocale: 'en',
      locales: {
        en: {
          label: 'English',
          lang: 'en',
        },
        fr: {
          label: 'Français',
          lang: 'fr',
        },
        'fr-ca': {
          label: 'Français (Canada)',
          lang: 'fr-CA',
        },
      },
      social: [
        { 
          icon: 'github', 
          label: 'GitHub', 
          href: 'https://github.com/csspecialist/Technical-Portfolio-2026' 
        }
      ],
      sidebar: [
        {
          label: 'API Monetization',
          translations: {
            fr: 'Monétisation des API',
            'fr-CA': 'Monétisation des API',
          },
          items: [
            {
              label: 'API Monetization Guide',
              link: '/api-monetization/api-monetization-guide/',
              translations: {
                fr: 'Guide de monétisation des API',
                'fr-CA': 'Guide de monétisation des API',
              },
            },
            {
              label: 'Entitlement Management API',
              link: '/api-monetization/entitlement-management-api/',
              translations: {
                fr: 'API de gestion des droits',
                'fr-CA': 'API de gestion des droits',
              },
            },
            {
              label: 'Usage-Based Billing',
              link: '/api-monetization/usage-based-billing/',
              translations: {
                fr: 'Facturation à l\'usage',
                'fr-CA': 'Facturation à l\'usage',
              },
            },
            {
              label: 'Usage Tracking Architecture',
              link: '/api-monetization/usage-tracking-architecture/',
              translations: {
                fr: 'Architecture de suivi d\'utilisation',
                'fr-CA': 'Architecture de suivi d\'utilisation',
              },
            },
          ],
        },
        {
          label: 'API & Developer Guides',
          translations: {
            fr: 'API et guides développeur',
            'fr-CA': 'API et guides développeur',
          },
          items: [
            {
              label: 'Auth API Quickstart',
              link: '/guides/auth-api-quickstart/',
              translations: {
                fr: 'Démarrage rapide API d\'authentification',
                'fr-CA': 'Démarrage rapide API d\'authentification',
              },
            },
          ],
        },
        {
          label: 'Governance',
          translations: {
            fr: 'Gouvernance',
            'fr-CA': 'Gouvernance',
          },
          items: [
            {
              label: 'AI Ethics Policy',
              link: '/governance/ai-ethics-policy/',
              translations: {
                fr: 'Politique d\'éthique IA',
                'fr-CA': 'Politique d\'éthique IA',
              },
            },
            {
              label: 'Security Statement',
              link: '/governance/security-statement/',
              translations: {
                fr: 'Déclaration de sécurité',
                'fr-CA': 'Déclaration de sécurité',
              },
            },
          ],
        },
        {
          label: 'Compliance',
          translations: {
            fr: 'Conformité',
            'fr-CA': 'Conformité',
          },
          items: [
            {
              label: 'Data Privacy',
              link: '/compliance/data-privacy/',
              translations: {
                fr: 'Confidentialité des données',
                'fr-CA': 'Confidentialité des données',
              },
            },
            {
              label: 'Enterprise Security Hub',
              link: '/compliance/enterprise-security-hub/',
              translations: {
                fr: 'Centre de sécurité entreprise',
                'fr-CA': 'Centre de sécurité entreprise',
              },
            },
          ],
        },
        {
          label: 'Operations & SOPs',
          translations: {
            fr: 'Opérations et procédures',
            'fr-CA': 'Procédures opérationnelles',
          },
          items: [
            {
              label: 'VPN MFA Configuration',
              link: '/operations/vpn-mfa-config/',
              translations: {
                fr: 'Configuration VPN MFA',
                'fr-CA': 'Configuration VPN AMF',
              },
            },
          ],
        },
      ],
    }),
  ],
  vite: {
    ssr: {
      noExternal: ['@astrojs/starlight'],
    },
    optimizeDeps: {
      exclude: ['@astrojs/starlight'],
    },
  },
});