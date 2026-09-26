import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { SearchItem } from './search-item/search-item';
import { Result, RGCatalogResponse } from './search.model';
import { BRANDS_CODES } from './brands.constants';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  imports: [SearchItem, MatProgressSpinnerModule],
  selector: 'tabs-search',
  styleUrl: './search.scss',
  templateUrl: './search.html',
})
export class Search {
  private http = inject(HttpClient);
  private rgAPI = '/rivegauche-api/';
  results = signal<Result[]>([]);
  readonly baseUrl = 'https://api.rivegauche.ru';
  brandCode = 0;
  isLoading = signal<boolean>(false);

  getBrand(code: number): Observable<RGCatalogResponse> {
    return this.http.get<RGCatalogResponse>(`${this.rgAPI}rg/v1/newRG/products/search`, {
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
  }

  getBrandProducts(): void {
    this.isLoading.set(true);

    this.getBrand(this.brandCode)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      ).subscribe((data) => { return this.results.set(data.results)});
  }

  searchBrand(event: Event) {
    const input = event.target as HTMLInputElement;

    this.brandCode = BRANDS_CODES[input.value];
    if(this.brandCode !== 0) {
      this.getBrandProducts();
    }
  }
}
