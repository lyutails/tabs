import { Service, signal } from '@angular/core';
import { Result } from '../../../../scripts/catalog-importer/catalog-importer.model';

@Service()
export class SearchStore {
    likedResults = signal<Result[]>([]);
    searchResults = signal<Result[]>([]);
    animNumber = signal<boolean>(false);
}
