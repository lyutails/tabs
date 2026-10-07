import { Component, inject, input, signal } from '@angular/core';
import { SearchStore } from '../../search/services/search-store';
import { TabsState } from '../services/tabs-state';

@Component({
  imports: [],
  selector: 'tabs-active-content',
  styleUrl: './active-content.scss',
  templateUrl: './active-content.html',
})
export class ActiveContent {
  index = input<number>();
  active = signal<boolean>(false);
  searchStore = inject(SearchStore);
  tabsState = inject(TabsState);

  activate() {
    this.active.set(false);

    requestAnimationFrame(() => {
      this.active.set(true);
    });
  }
}
