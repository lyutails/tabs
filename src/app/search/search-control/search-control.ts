import { Component, ElementRef, inject, linkedSignal, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SearchService } from '../service/search-service';
import { finalize } from 'rxjs';
import { SearchStore } from '../services/search-store';
import { BRANDS_CODES } from '../brands.constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Result } from '../../../catalog-importer/catalog-importer.model';

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
  protected brandCode = 0;
  protected input = viewChild<ElementRef<HTMLInputElement>>('input');
  protected snackBar = inject(MatSnackBar);
  showBrands = { name: 'brand', signal: signal<boolean>(false) };
  showCountry = { name: 'country', signal: signal<boolean>(false) };
  showUse = { name: 'use', signal: signal<boolean>(false) };
  showPurpose = { name: 'purpose', signal: signal<boolean>(false) };
  showFilters = [this.showBrands, this.showCountry, this.showUse, this.showPurpose];
  countries: string[] = ['Japan', 'Korea', 'China', 'Russia', 'Europe'];
  useCases: string[] = ['Cream', 'Serum', 'Eye cream', 'Toner', 'Milky Essence', 'Body'];
  purposes: string[] = ['Moisture', 'Nourish', 'Repair'];

  getBrandProducts(brands: string[]): void {
    this.searchService.isLoading.set(true);

    this.searchService.getBrand(brands)
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

  searchBrand(brand: string) {
    this.brandName.set(brand);
    if (BRANDS_CODES[this.brandName()]) {
      this.getBrandProducts([brand]);
    } else {
      this.searchPopular();
    }
  }

  searchPopular() {
    this.searchService.isLoading.set(true);

    this.brandCode = 0;

    const brands = Object.keys(BRANDS_CODES);
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];

    this.searchService.getBrand(brands)
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
    } else {
      const filteredBrands = Object.keys(BRANDS_CODES).filter((brand) => this.normalizeBrand(brand).includes(this.normalizeBrand(value)));
      if (value) {
        this.isHiddenSliderArrows.set(true)
      } else {
        this.isHiddenSliderArrows.set(false)
      }
      this.brandSuggestions.set(filteredBrands);
      this.getBrandProducts(this.brandSuggestions());
    }
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
    })
  }
}
