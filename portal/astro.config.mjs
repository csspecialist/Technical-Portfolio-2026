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
                { icon: 'github', label: 'GitHub', href: 'https://github.com/csspecialist/Technical-Portfolio-2026' }
            ],
            sidebar: [
                {
                    label: 'Getting Started',
                    // REMOVED /en/ prefix so it works in all languages
                    link: 'guides/auth-api-quickstart/', 
                },
                {
                    label: 'Guides',
                    // REMOVED en/ so it looks in the current language folder
                    autogenerate: { directory: 'guides' },
                },
                {
                    label: 'SOPs',
                    // REMOVED en/
                    autogenerate: { directory: 'sops' },
                },
                {
                    label: 'Compliance',
                    // REMOVED en/
                    autogenerate: { directory: 'compliance' },
                },
            ],
        }),
    ],
});