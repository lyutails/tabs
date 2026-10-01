import { Component, ElementRef, inject, linkedSignal, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SearchService } from '../service/search-service';
import { finalize } from 'rxjs';
import { Result } from '../search.model';
import { SearchStore } from '../services/search-store';
import { BRANDS_CODES } from '../brands.constants';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  protected results = signal<Result[]>([]);
  searchStore = inject(SearchStore);
  isHiddenSliderArrows = linkedSignal<boolean>(() => false);
  protected suggestions = viewChild<ElementRef<HTMLElement>>('suggestions');
  protected brandSuggestions = signal<string[]>(Object.keys(BRANDS_CODES));
  protected brandCode = 0;
  protected input = viewChild<ElementRef<HTMLInputElement>>('input');
  protected snackBar = inject(MatSnackBar);

  getBrandProducts(): void {
    this.searchService.isLoading.set(true);

    this.searchService.getBrand(this.filteredCodes())
      .pipe(
        finalize(() => {
          this.searchService.isLoading.set(false);
        })
      ).subscribe((data) => {
        const products = data.flatMap(response => response.results);
        this.results.set(products);
        this.searchStore.searchResults.set(products);
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
    this.searchService.isLoading.set(true);

    this.brandName.set('');

    this.brandCode = 0;

    this.searchService.getBrand([this.brandCode])
      .pipe(
        finalize(() => {
          this.searchService.isLoading.set(false);
        })
      ).subscribe((data) => {
        const products = data.flatMap(response => response.results);
        this.results.set(products);
        this.searchStore.searchResults.set(products);
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
      this.brandCode = BRANDS_CODES[this.brandName()];
      const filteredBrands = Object.keys(BRANDS_CODES).filter((brand) => this.normalizeBrand(brand).includes(this.normalizeBrand(value)));
      if (value) {
        this.isHiddenSliderArrows.set(true)
      } else {
        this.isHiddenSliderArrows.set(false)
      }
      this.brandSuggestions.set(filteredBrands);
      const filteredCodes = filteredBrands.map((brand) => BRANDS_CODES[brand as keyof typeof BRANDS_CODES]);
      this.filteredCodes.set(filteredCodes);
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
