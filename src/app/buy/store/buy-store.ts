import { computed, Service, signal } from '@angular/core';
import { Result } from '../../search/search.model';

@Service()
export class BuyStore {
    buyResults = signal<Result[]>([]);
    total = computed(() =>
        this.buyResults().reduce((sum, item) => {
            const price = Number(
                item.price.formattedValue.replace(/[^0-9.-]+/g, '')
            );

            return sum + price;
        }, 0)
    );

    removeAllFromCart() {
        this.buyResults.set([]);
    }
}
