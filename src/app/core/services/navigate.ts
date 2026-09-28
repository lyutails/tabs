import { inject, Service } from '@angular/core';
import { Router } from '@angular/router';

@Service()
export class Navigate {
    router = inject(Router);

    navigate(route: string | number): void {
        if (typeof route === 'string') {
            switch (route) {
                case 'search':
                    this.router.navigate(['search']);
                    break;
                case 'liked':
                    this.router.navigate(['liked']);
                    break;
                case 'buy':
                    this.router.navigate(['buy']);
                    break;
                case 'profile':
                    this.router.navigate(['profile']);
                    break;
                default:
                    this.router.navigate(['']);
            }
        }

        if (typeof route === 'number') {
            switch (route) {
                case 0:
                    this.router.navigate(['search']);
                    break;
                case 1:
                    this.router.navigate(['liked']);
                    break;
                case 2:
                    this.router.navigate(['buy']);
                    break;
                case 3:
                    this.router.navigate(['profile']);
                    break;
                default:
                    this.router.navigate(['']);
            }
        }
    }
}
