import { Service, signal } from '@angular/core';

@Service()
export class Motion {
    divider = signal<boolean>(false);
}
