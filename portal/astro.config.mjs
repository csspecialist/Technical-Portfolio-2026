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
          // Direct link to your primary quickstart
          link: 'guides/auth-api-quickstart/', 
        },
        {
          label: 'Core Guides',
          // Automatically builds navigation based on the /guides/ folder
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'Standard Operating Procedures',
          // Professional title for the SOPs section
          autogenerate: { directory: 'sops' },
        },
        {
          label: 'Governance & Compliance',
          // Organized section for regulatory/internal docs
          autogenerate: { directory: 'compliance' },
        },
        {
          label: 'System Architecture',
          // A dedicated spot for your high-level engineering docs
          autogenerate: { directory: 'architecture' },
        },
      ],
    }),
  ],
});