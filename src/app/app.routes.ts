import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./tabs/tabs').then(m => m.Tabs),
        title: 'Tabs'
    },
    {
        path: 'profile',
        loadComponent: () =>
            import('./profile/profile').then(m => m.Profile),
        title: 'Tabs Editor'
    },
    {
        path: 'search',
        loadComponent: () =>
            import('./search/search').then(m => m.Search),
        title: 'Tabs Editor'
    },
    {
        path: 'found',
        loadComponent: () =>
            import('./found/found').then(m => m.Found),
        title: 'Tabs Editor'
    },
    {
        path: 'buy',
        loadComponent: () =>
            import('./buy/buy').then(m => m.Buy),
        title: 'Tabs Editor'
    },
    {
        path: '**',
        loadComponent: () =>
            import('./core/not-found/not-found').then(m => m.NotFound),
        title: '404'
    },
];
