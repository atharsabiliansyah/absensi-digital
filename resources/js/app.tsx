
/// <reference types="vite/client" />

import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';

const appName =
    window.document.getElementsByTagName('title')[0]?.innerText ||
    'Absensi Digital - SMK 11 PGRI CILEDUG';

const pages = import.meta.glob('./Pages/**/*.{tsx,jsx}');

createInertiaApp({
    title: (title) => `${title} - ${appName}`,

    resolve: async (name) => {
        const tsxPath = `./Pages/${name}.tsx`;
        const jsxPath = `./Pages/${name}.jsx`;

        const page = pages[tsxPath] ?? pages[jsxPath];

        if (!page) {
            throw new Error(
                `Halaman "${name}" tidak ditemukan. Periksa nama dan lokasi file.`
            );
        }

        return page();
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: '#4B5563',
    },
});
