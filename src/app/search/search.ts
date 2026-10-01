import { Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { SearchItem } from './search-item/search-item';
import { Result } from './search.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { SearchStore } from './services/search-store';
import { Found } from '../found/found';
import { ActivatedRoute } from '@angular/router';
import { BuyStore } from '../buy/store/buy-store';
import { SearchControl } from './search-control/search-control';
import { SearchService } from './service/search-service';

@Component({
  imports: [SearchItem, MatProgressSpinnerModule, MatButtonModule, MatInputModule,
    FormsModule, MatFormFieldModule, MatIconModule, CdkDrag, CdkDropList, Found,
    SearchControl
  ],
  selector: 'tabs-search',
  styleUrl: './search.scss',
  templateUrl: './search.html',
})
export class Search {
  layout = input<'default' | 'side' | 'search'>('default');
  currentPage = '';
  private route = inject(ActivatedRoute);
  protected buyStore = inject(BuyStore);
  searchStore = inject(SearchStore);
  protected searchService = inject(SearchService);

  ngOnInit() {
    this.currentPage = this.route.snapshot.url[0]?.path;
  }

  dropToLiked(event: CdkDragDrop<Result[]>): void {
    if (event.previousContainer.id !== 'resultsList') {
      return;
    }

    const result = event.item.data;

    this.searchStore.likedResults.update((items) => {
      if (items.some(item => item.code === result.code)) {
        return items;
      }
      return [...items, result];
    })
  }
}
