import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { finalize, forkJoin, Observable } from 'rxjs';
import { SearchItem } from './search-item/search-item';
import { Result, RGCatalogResponse } from './search.model';
import { BRANDS_CODES } from './brands.constants';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [SearchItem, MatProgressSpinnerModule, MatButtonModule, MatInputModule,
    FormsModule, MatFormFieldModule, MatIconModule
  ],
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
  input = viewChild<ElementRef<HTMLInputElement>>('input');
  brandName = signal('');
  brandSuggestions = signal<string[]>(Object.keys(BRANDS_CODES));
  filteredCodes = signal<number[]>([]);
  protected snackBar = inject(MatSnackBar);
  suggestions = viewChild<ElementRef<HTMLElement>>('suggestions');

  getBrand(codes: number[]): Observable<RGCatalogResponse[]> {
    const requestedBrandsItems = codes.map((code) =>
      this.http.get<RGCatalogResponse>(`${this.rgAPI}rg/v1/newRG/products/search`, {
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

  getBrandProducts(): void {
    this.isLoading.set(true);

    this.getBrand(this.filteredCodes())
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      ).subscribe((data) => {
        const products = data.flatMap(response => response.results);
        this.results.set(products);
      });
  }

  searchBrand(brand: string) {
    this.brandName.set(brand);
    this.brandCode = BRANDS_CODES[this.brandName()];
    this.filteredCodes.set([this.brandCode]);
    if (this.brandCode !== 0) {
      this.getBrandProducts();
    } else {
      this.searchPopular();
    }
  }

  searchPopular() {
    this.isLoading.set(true);

    this.brandName.set('');

    this.brandCode = 0;

    this.getBrand([this.brandCode])
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      ).subscribe((data) => {
        const products = data.flatMap(response => response.results);
        this.results.set(products);
      });
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.toLowerCase();
    this.brandName.set(value);
    const isEnglish = /^[a-z\s.'-]+$/i.test(value);
    const isEmpty = value.length === 0;
    if (!isEnglish && !isEmpty) {
      this.snackBar.open('Change layout to English, please', 'ok', { duration: 5000 });
    } else {
      this.brandCode = BRANDS_CODES[this.brandName()];
      const filteredBrands = Object.keys(BRANDS_CODES).filter((brand) => brand.includes(value));
      this.brandSuggestions.set(filteredBrands);
      const filteredCodes = filteredBrands.map((brand) => BRANDS_CODES[brand as keyof typeof BRANDS_CODES]);
      this.filteredCodes.set(filteredCodes);
      console.log(filteredCodes);
      this.getBrandProducts();
    }
  }

  scrollSuggestions(direction: 'left' | 'right'): void {
    this.suggestions()?.nativeElement.scrollBy({
      left: direction === 'right' ? 200 : -200,
      behavior: 'smooth',
    })
  }
}
