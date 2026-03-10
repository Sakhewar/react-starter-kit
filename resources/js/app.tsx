import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { ThemeProvider } from './providers/ThemeProvider';
import { route } from 'ziggy-js';
import { Ziggy } from '../js/ziggy';          // ← Importe Ziggy
import { TooltipProvider } from './components/ui/tooltip';


const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider>
                <TooltipProvider>
                    <App {...props} />
                </TooltipProvider>
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
