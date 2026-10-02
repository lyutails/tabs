import { inject, Service, signal } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Result } from '../../../catalog-importer/catalog-importer.model';

@Service()
export class SearchService {
    private http = inject(HttpClient);
    isLoading = signal<boolean>(false);
    
    getBrand(brands: string[]): Observable<Result[][]> {
        const requestedBrandsItems = brands.map((brand) =>
            this.http.get<Result[]>('/api/products', {
                params: {
                    brand,
                    page: 1,
                    pageSize: 36,
                },
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Accept-Language': 'ru',
                }
            })
        )
        return forkJoin(requestedBrandsItems);
    }
}
