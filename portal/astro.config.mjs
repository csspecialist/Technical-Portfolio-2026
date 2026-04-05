// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/': '/en/',
  },
  integrations: [
    starlight({
      title: 'Technical Documentation Lab',
      // Set English as the default language
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
          label: 'Getting Started',
          translations: {
            fr: 'Premiers pas',
            'fr-CA': 'Premiers pas',
          },
          link: 'guides/auth-api-quickstart/', 
        },
        {
          label: 'Governance & Compliance',
          translations: {
            fr: 'Gouvernance et conformité',
            'fr-CA': 'Gouvernance et conformité',
          },
          autogenerate: { directory: 'compliance' },
        },
        {
          label: 'Core Guides',
          translations: {
            fr: 'Guides essentiels',
            'fr-CA': 'Guides essentiels',
          },
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'Standard Operating Procedures',
          translations: {
            fr: 'Modes opératoires standard',
            'fr-CA': 'Procédures opératoires normalisées',
          },
          autogenerate: { directory: 'sops' },
        },
        {
          label: 'System Architecture',
          translations: {
            fr: 'Architecture système',
            'fr-CA': 'Architecture système',
          },
          autogenerate: { directory: 'architecture' },
        },
      ],
    }),
  ],
});