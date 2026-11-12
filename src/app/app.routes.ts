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
        title: 'Profile'
    },
    {
        path: 'search',
        loadComponent: () =>
            import('./search/search').then(m => m.Search),
        title: 'Search'
    },
    {
        path: 'liked',
        loadComponent: () =>
            import('./found/found').then(m => m.Found),
        title: 'Liked Products'
    },
    {
        path: 'buy',
        loadComponent: () =>
            import('./buy/buy').then(m => m.Buy),
        title: 'Buy Products'
    },
    {
        path: '3dstore',
        loadComponent: () =>
            import('./interactive-store/interactive-store').then(m => m.InteractiveStore),
        title: '3D Interactive Store'
    },
    {
        path: 'lab',
        loadComponent: () =>
            import('./lab/lab').then(m => m.Lab),
        title: 'Ingredients Lab'
    },
    {
        path: '**',
        loadComponent: () =>
            import('./core/not-found/not-found').then(m => m.NotFound),
        title: '404'
    },
];
