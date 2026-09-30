import { Service, signal } from '@angular/core';
import { Result } from '../../search/search.model';

@Service()
export class BuyStore {
    buyResults = signal<Result[]>([]);
    total = signal<number>(0);

    countTotalPrice() {
        this.total.update(() =>
            this.buyResults().reduce((sum, item) => {
                const price = Number(
                    item.price.formattedValue.replace(/[^0-9.-]+/g, '')
                );

                return sum + price;
            }, 0)
        );

        return this.total;
    }
}
