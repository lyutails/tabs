import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./tabs/tabs').then(m => m.Tabs),
        title: 'Tabs'
    },
];
