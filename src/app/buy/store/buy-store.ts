import { computed, inject, Service, signal } from '@angular/core';
import { SearchStore } from '../../search/services/search-store';
import { Result } from '../../../catalog-importer/catalog-importer.model';

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
        console.log(value);
        const result = this.searchStore.searchResults().find((item) => item.code === value);

        console.log(result);
        if (result) {
            this.buyResults.update((items) => [...items, result]);

            this.animNumber.set(false);

            requestAnimationFrame(() =>
                this.animNumber.set(true));
        }
    }

    removeFromCart(value: string): void {
        this.buyResults.update((items) =>
            items.filter((item) => item.code !== value)
        );

        this.animNumber.set(false);

        requestAnimationFrame(() =>
            this.animNumber.set(true)
        );
    }

    isInCart(code: string): boolean {
        return this.buyResults().some(item => item.code === code);
    }
}
