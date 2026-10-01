import { Service, signal } from '@angular/core';

@Service()
export class AdvertismentService {
    isAdvertisment = signal<boolean>(true);

    toggleAdvertisment() {
        this.isAdvertisment.set(!this.isAdvertisment());
    }
}
