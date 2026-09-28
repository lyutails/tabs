import { inject, Service } from '@angular/core';
import { RGCatalogResponse } from '../search.model';
import { forkJoin, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RIVE_GAUCHE_API } from '../../core/constants/api.constants';

@Service()
export class SearchService {
    private http = inject(HttpClient);
    
    getBrand(codes: number[]): Observable<RGCatalogResponse[]> {
        const requestedBrandsItems = codes.map((code) =>
            this.http.get<RGCatalogResponse>(`${RIVE_GAUCHE_API}rg/v1/newRG/products/search`, {
                params: {
                    fields: 'BASIC',
                    currentPage: 0,
                    pageSize: 36,
                    categoryCode: 'NewNav',
                    brandCode: `rg_brand_${code}`,
                    rmSessionId: '68862355df126c3f7464b3e8',
                    locale: 'ru',
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
