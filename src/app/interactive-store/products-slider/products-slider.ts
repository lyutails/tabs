import { Component, inject, signal } from '@angular/core';
import { BRANDS_CODES } from '../../search/brands.constants';
import { SearchService } from '../../search/service/search-service';
import { finalize } from 'rxjs';
import { SearchStore } from '../../search/services/search-store';
import { Result } from '../../../../scripts/catalog-importer/catalog-importer.model';
import { ProductsModal } from '../products-modal/products-modal';

@Component({
  imports: [ProductsModal],
  selector: 'tabs-products-slider',
  styleUrl: './products-slider.scss',
  templateUrl: './products-slider.html',
})
export class ProductsSlider {
  searchService = inject(SearchService);
  searchStore = inject(SearchStore);
  protected results = signal<Result[]>([]);
  isOpenModal = signal<boolean>(false);
  currentResult: Result | null = null;
  
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
        }
      });
  }

  openProductModal(value: Result) {
    this.isOpenModal.set(!this.isOpenModal);
    this.currentResult = value;
    console.log(value)
  }
}
