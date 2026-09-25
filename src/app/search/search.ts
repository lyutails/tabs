import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchItem } from './search-item/search-item';

export interface RGCatalogResponse {
  results: Result[];
}

interface Result {
  addedToCart: boolean;
  addedToWishlist: boolean;
  basePrice: BasePrice;
  brand: Brand;
  canAddToCart: boolean;
  code: string;
  firstVariant: string;
  foreign: boolean;
  hasVariantType: boolean;
  inStockVariantCodes: number[];
  listingImage: ListingImage;
  listingImagesCount: number;
  name: string;
  notifyStockAvailability: boolean;
  price: Price;
  showcases: Showcase[];
  stock: Stock;
  subtitle: string;
  url: string;
  variantAttributeType: string;
  variantOptions: string[];
}

interface BasePrice {
  currencyIso: string;
  formattedValue: string;
  value: number;
}

interface Brand {
  code: string;
  name: string;
}

interface ListingImage {
  code: string;
  format: string;
  height: number;
  mime: string;
  url: string;
  width: number;
}

interface Price {
  currencyIso: string;
  formattedValue: string;
  priceType: string;
  value: number;
}

interface Showcase {
  backgroundColor: string;
  canCopy: boolean;
  code: string;
  discountPercent: number;
  fontColor: string;
  name: string;
}

type Stock = { stockLevelStatus: string };

@Component({
  imports: [SearchItem],
  selector: 'tabs-search',
  styleUrl: './search.scss',
  templateUrl: './search.html',
})
export class Search {
  private http = inject(HttpClient);
  private rgAPI = '/rivegauche-api/';
  results = signal<Result[]>([]);
  readonly baseUrl = 'https://api.rivegauche.ru';

  getBrand(): Observable<RGCatalogResponse> {
    return this.http.get<RGCatalogResponse>(`${this.rgAPI}rg/v1/newRG/products/search`, {
      params: {
        fields: 'BASIC',
        currentPage: 0,
        pageSize: 36,
        categoryCode: 'NewNav',
        brandCode: 'rg_brand_1386',
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
    this.getBrand().subscribe((data) => this.results.set(data.results));
  }
}
