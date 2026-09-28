import { Component, inject } from '@angular/core';
import { SearchStore } from '../search/services/search-store';

@Component({
  imports: [],
  selector: 'tabs-found',
  styleUrl: './found.scss',
  templateUrl: './found.html',
})
export class Found {
  searchStore = inject(SearchStore);
}
