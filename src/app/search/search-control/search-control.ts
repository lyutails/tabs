import { Component, computed, ElementRef, inject, linkedSignal, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SearchService } from '../service/search-service';
import { finalize } from 'rxjs';
import { SearchStore } from '../services/search-store';
import { BRANDS_CODES } from '../brands.constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Result } from '../../../../scripts/catalog-importer/catalog-importer.model';

@Component({
  imports: [MatIconModule, MatInputModule,
    FormsModule, MatFormFieldModule],
  selector: 'tabs-search-control',
  styleUrl: './search-control.scss',
  templateUrl: './search-control.html',
})
export class SearchControl {
  protected brandName = signal('');
  private searchService = inject(SearchService);
  protected isLoading = signal<boolean>(false);
  protected filteredCodes = signal<number[]>([]);
  protected filteredNames = signal<string[]>([]);
  protected results = signal<Result[]>([]);
  searchStore = inject(SearchStore);
  isHiddenSliderArrows = linkedSignal<boolean>(() => false);
  protected suggestions = viewChild<ElementRef<HTMLElement>>('suggestions');
  protected brandSuggestions = signal<string[]>(Object.keys(BRANDS_CODES));
  protected allBrands = signal<string[]>(Object.keys(BRANDS_CODES));
  protected brandCode = 0;
  protected input = viewChild<ElementRef<HTMLInputElement>>('input');
  protected snackBar = inject(MatSnackBar);
  showBrands = { name: 'brand', signal: signal<boolean>(false) };
  showCountry = { name: 'country', signal: signal<boolean>(false) };
  showUse = { name: 'use', signal: signal<boolean>(false) };
  showPurpose = { name: 'purpose', signal: signal<boolean>(false) };
  showFilters = [this.showBrands, this.showCountry, this.showUse, this.showPurpose];
  countries: string[] = ['Japan', 'Korea', 'China', 'Russia', 'Europe', 'USA / Canada'];
  useCases: string[] = ['Cream', 'Serum', 'Eye cream', 'Toner', 'Essence', 'Body', 'Milk'];
  purposes: string[] = ['Cleanse', 'Moisture', 'Nourish', 'Repair', 'Exfoliate', 'Retinol', 'PDRN', 'Peptides', 'Aromatherapy'];
  searchPlaceholders: string[] = ['darphin', 'erborian', 'cream', 'serum', 'korea'];
  selfTyping = signal<string>('');
  searchInput = viewChild<ElementRef<HTMLInputElement>>('input');
  openedFilter = computed(() => this.showFilters.find(filter => filter.signal())?.name ?? '')

  getProduct(brands: string[], search: string): void {
    this.searchService.isLoading.set(true);

    this.searchService.getProducts(brands, search)
      .pipe(
        finalize(() => {
          this.searchService.isLoading.set(false);
        })
      ).subscribe((data) => {
        const products = data.flatMap(response => response);
        this.results.set(products);
        this.searchStore.searchResults.set(products);
      });
  }

  searchBrand(value: string) {
    this.brandName.set(value);
    this.showAvailableFilter('');
    if (BRANDS_CODES[this.brandName()]) {
      this.getProduct([value], '');
    } else {
      this.getProduct([''], value);
    }
  }

  searchPopular() {
    this.searchService.isLoading.set(true);

    this.brandName.set('');

    this.brandCode = 0;

    const brands = Object.keys(BRANDS_CODES);

    this.showAvailableFilter('');

    this.searchService.getProducts(brands, '')
      .pipe(
        finalize(() => {
          this.searchService.isLoading.set(false);
        })
      ).subscribe((data) => {
        const products = data.flatMap(response => response.filter((product) => product.popular));
        if (products) {
          this.results.set(products);
          this.searchStore.searchResults.set(products);
        }
      });
  }

  searchCountry(value: string) {
    this.showAvailableFilter('');
    let country = value.toLowerCase();
    if (value === 'USA / Kanada') {
      country = 'usa';
    }
    if (value === 'Japan') {
      this.snackBar.open('Coming soon!', 'ok', { duration: 5000 });
    }

    this.searchService.isLoading.set(true);

    this.brandName.set('');

    this.brandCode = 0;

    const brands = Object.keys(BRANDS_CODES);

    this.searchService.getProducts(brands, '')
      .pipe(
        finalize(() => {
          this.searchService.isLoading.set(false);
        })
      ).subscribe((data) => {
        const products = data.flatMap(response => response.filter((product) => product.country === country));
        if (products.length > 0) {
          this.results.set(products);
          this.searchStore.searchResults.set(products);
        }
      });
  }

  searchByUse(value: string) {
    this.showAvailableFilter('');
    let use = value.toLowerCase();

    this.searchService.isLoading.set(true);

    this.brandName.set('');

    this.brandCode = 0;

    const brands = Object.keys(BRANDS_CODES);

    this.searchService.getProducts(brands, '')
      .pipe(
        finalize(() => {
          this.searchService.isLoading.set(false);
        })
      ).subscribe((data) => {
        const products = data.flatMap(response => response.filter((product) => product.name.toLowerCase().includes(use)));
        if (products.length > 0) {
          this.results.set(products);
          this.searchStore.searchResults.set(products);
        }
      });
  }

  searchByPurpose(value: string) {
    this.showAvailableFilter('');
    let purpose = value.toLowerCase();

    this.searchService.isLoading.set(true);

    this.brandName.set('');

    this.brandCode = 0;

    const brands = Object.keys(BRANDS_CODES);

    this.searchService.getProducts(brands, '')
      .pipe(
        finalize(() => {
          this.searchService.isLoading.set(false);
        })
      ).subscribe((data) => {
        const products = data.flatMap(response => response.filter((product) => product.purpose === purpose));
        if (products.length > 0) {
          this.results.set(products);
          this.searchStore.searchResults.set(products);
        }
      });
  }

  normalizeBrand(value: string): string {
    return value.toLowerCase().replace(/[\s-]+/g, '');
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.toLowerCase();
    this.brandName.set(value);
    const isEnglish = /^[a-z\s.'-]+$/i.test(value);
    const isEmpty = value.length === 0;
    if (!isEnglish && !isEmpty) {
      this.snackBar.open('Change layout to English, please', 'ok', { duration: 5000 });
      return;
    }
    if (!value) { this.brandSuggestions.set(this.allBrands()); this.getProduct(Object.keys(BRANDS_CODES), ''); return; }
    const matchedBrand = Object.keys(BRANDS_CODES).find((brand) => this.normalizeBrand(value).startsWith(this.normalizeBrand(brand)));
    if (matchedBrand) {
      const search = value.slice(matchedBrand.length).trim(); this.brandSuggestions.set([matchedBrand]); this.getProduct([matchedBrand], search); return;
    }
    const filteredBrands = Object.keys(BRANDS_CODES).filter((brand) => this.normalizeBrand(brand).includes(this.normalizeBrand(value)));
    this.brandSuggestions.set(filteredBrands); this.getProduct(Object.keys(BRANDS_CODES), value);
  }

  scrollSuggestions(direction: 'left' | 'right'): void {
    this.suggestions()?.nativeElement.scrollBy({
      left: direction === 'right' ? 200 : -200,
      behavior: 'smooth',
    })
  }

  showAvailableFilter(value: string) {
    this.showFilters.forEach((filter, index) => {
      if (filter.name === value && filter.signal() === false) {
        filter.signal.set(true);
      } else {
        filter.signal.set(false);
      }
      if (filter.name !== value) {
        filter.signal.set(false);
      }
      if (value === '') {
        filter.signal.set(false);
      }
    })
  }
}
