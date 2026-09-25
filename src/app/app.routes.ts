import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./tabs/tabs').then(m => m.Tabs),
        title: 'Tabs'
    },
    {
        path: 'editor',
        loadComponent: () =>
            import('./editor/editor').then(m => m.Editor),
        title: 'Tabs Editor'
    },
    {
        path: '**',
        loadComponent: () =>
            import('./core/not-found/not-found').then(m => m.NotFound),
        title: '404'
    },
];
