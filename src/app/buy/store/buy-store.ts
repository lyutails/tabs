import { Service, signal } from '@angular/core';
import { Result } from '../../search/search.model';

@Service()
export class BuyStore {
    buyResults = signal<Result[]>([]);
}
