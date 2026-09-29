import { Component, inject, input, OnInit } from '@angular/core';
import { SearchStore } from '../search/services/search-store';
import { SearchItem } from '../search/search-item/search-item';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyStore } from '../buy/store/buy-store';
import { Navigate } from '../core/services/navigate';

@Component({
  imports: [SearchItem, MatIconModule, MatTooltipModule],
  selector: 'tabs-found',
  styleUrl: './found.scss',
  templateUrl: './found.html',
})
export class Found implements OnInit {
  searchStore = inject(SearchStore);
  router = inject(Router);
  private route = inject(ActivatedRoute);
  currentPage = '';
  buyStore = inject(BuyStore);
  navigateService = inject(Navigate);
  layout = input<'default' | 'side' | 'search'>('default');

  ngOnInit() {
    this.currentPage = this.route.snapshot.url[0]?.path;
  }

  removeAllLiked(): void {
    this.searchStore.likedResults.set([]);
  }

  removeSingleLiked(code: string): void {
    this.searchStore.likedResults.update((items) => items.filter((item) => item.code !== code))
  }

  navigate(value: string | number): void {
    this.navigateService.navigate(value);
  }

  addToCart(value: string): void {
    const result = this.searchStore.likedResults().find((item) => item.code === value);
    if (result) {
      this.buyStore.buyResults.update((items) => [...items, result]);
    }
  }
}
