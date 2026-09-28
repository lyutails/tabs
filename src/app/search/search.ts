import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { SearchItem } from './search-item/search-item';
import { Result } from './search.model';
import { BRANDS_CODES } from './brands.constants';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { SearchService } from './service/search-service';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  imports: [SearchItem, MatProgressSpinnerModule, MatButtonModule, MatInputModule,
    FormsModule, MatFormFieldModule, MatIconModule, CdkDrag, CdkDropList
  ],
  selector: 'tabs-search',
  styleUrl: './search.scss',
  templateUrl: './search.html',
})
export class Search {
  protected results = signal<Result[]>([]);
  protected brandCode = 0;
  protected isLoading = signal<boolean>(false);
  protected input = viewChild<ElementRef<HTMLInputElement>>('input');
  protected brandName = signal('');
  protected brandSuggestions = signal<string[]>(Object.keys(BRANDS_CODES));
  protected filteredCodes = signal<number[]>([]);
  protected snackBar = inject(MatSnackBar);
  protected suggestions = viewChild<ElementRef<HTMLElement>>('suggestions');
  private searchService = inject(SearchService);

  getBrandProducts(): void {
    this.isLoading.set(true);

    this.searchService.getBrand(this.filteredCodes())
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

    this.searchService.getBrand([this.brandCode])
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      ).subscribe((data) => {
        const products = data.flatMap(response => response.results);
        this.results.set(products);
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


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.results(), event.previousIndex, event.currentIndex);
  }
}
