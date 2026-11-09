import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { BRANDS_CODES } from '../../search/brands.constants';
import { SearchService } from '../../search/service/search-service';
import { finalize } from 'rxjs';
import { SearchStore } from '../../search/services/search-store';
import { Result } from '../../../../scripts/catalog-importer/catalog-importer.model';
import { ModalState } from '../modal-state';

@Component({
  imports: [],
  selector: 'tabs-products-slider',
  styleUrl: './products-slider.scss',
  templateUrl: './products-slider.html',
})
export class ProductsSlider {
  searchService = inject(SearchService);
  searchStore = inject(SearchStore);
  protected results = signal<Result[]>([]);
  currentResult: Result | null = null;
  modalStateService = inject(ModalState);
  @ViewChild('productsTrack')
  private productsTrack!: ElementRef<HTMLElement>;
  canScrollLeft = signal(false);
  canScrollRight = signal(false);

  getProducts(value: string) {
    const brands = Object.keys(BRANDS_CODES);
    let use = value.toLowerCase();

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

          requestAnimationFrame(() => {
            this.updateScrollButtons();
          });
        }
      });
  }

  getByCountry(value: string) {
    const brands = Object.keys(BRANDS_CODES);
    let country = value.toLowerCase();

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

          requestAnimationFrame(() => {
            this.updateScrollButtons();
          });
        }
      });
  }

  openProductModal(value: Result) {
    this.currentResult = value;
    this.modalStateService.isOpenModal.set(true);
  }

  clearResults(): void {
    this.results.set([]);
  }

  updateScrollButtons(): void {
    const track = this.productsTrack?.nativeElement;

    if (!track) return;

    const maxScrollLeft = track.scrollWidth - track.clientWidth;

    this.canScrollLeft.set(track.scrollLeft > 1);
    this.canScrollRight.set(
      maxScrollLeft > 1 &&
      track.scrollLeft < maxScrollLeft - 1
    );
  }

  scrollProducts(direction: -1 | 1): void {
    const track = this.productsTrack?.nativeElement;

    if (!track) return;

    const firstItem = track.firstElementChild as HTMLElement | null;

    if (!firstItem) return;

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const amount = (firstItem.getBoundingClientRect().width + gap) * 2;

    track.scrollBy({
      left: direction * amount,
      behavior: 'smooth',
    });
  }
}
