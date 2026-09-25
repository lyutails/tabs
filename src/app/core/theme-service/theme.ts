import { Service, signal } from '@angular/core';

@Service()
export class Theme {
    theme = signal<'dark' | 'light'>('light');
    
    toggleTheme(): void {
        if (this.theme() === 'light') {
            this.theme.set('dark');
        } else {
            this.theme.set('light');
        }
    }
}
