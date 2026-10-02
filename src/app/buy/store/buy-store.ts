import { computed, inject, Service, signal } from '@angular/core';
import { Result } from '../../search/search.model';
import { SearchStore } from '../../search/services/search-store';

@Service()
export class BuyStore {
    searchStore = inject(SearchStore);
    buyResults = signal<Result[]>([]);
    total = computed(() =>
        this.buyResults().reduce((sum, item) => {
            const price = Number(
                item.price.formattedValue.replace(/[^0-9.-]+/g, '')
            );

            return sum + price;
        }, 0)
    );
    animNumber = signal<boolean>(false);

    removeAllFromCart() {
        this.buyResults.set([]);
    }

    addToCart(value: string): void {
        const result = this.searchStore.searchResults().find((item) => item.code === value);

        if (result) {
            this.buyResults.update((items) => [...items, result]);

            this.animNumber.set(false);

            requestAnimationFrame(() =>
                this.animNumber.set(true));

            console.log('buy');
        }
    }
}
