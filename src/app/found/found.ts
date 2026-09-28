import { Component, inject, OnInit } from '@angular/core';
import { SearchStore } from '../search/services/search-store';
import { SearchItem } from '../search/search-item/search-item';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';

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

  ngOnInit() {
    this.currentPage = this.route.snapshot.url[0]?.path;
  }

  removeAllLiked(): void {
    this.searchStore.likedResults.set([]);
  }

  removeSingleLiked(code: string): void {
    this.searchStore.likedResults.update((items) => items.filter((item) => item.code !== code))
  }

  navigate(value: string) {
    if (value === 'liked') {
      this.router.navigate(['/liked']);
    } else {
      this.router.navigate(['/search']);
    }
  }

  buySeleted() {}
}
