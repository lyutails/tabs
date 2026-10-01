import { Service, signal } from '@angular/core';

@Service()
export class AdvertismentService {
    isAdvertisment = signal<boolean>(false);

    toggleAdvertisment() {
        this.isAdvertisment.set(!this.isAdvertisment());
    }
}
