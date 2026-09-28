import { Service, signal } from '@angular/core';
import { Result } from '../search.model';

@Service()
export class SearchStore {
    likedResults = signal<Result[]>([]);
}
