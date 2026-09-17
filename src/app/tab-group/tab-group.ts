import { Component, computed, contentChild, contentChildren, effect, QueryList } from '@angular/core';
import { Tab } from '../tab/tab';

@Component({
  imports: [],
  selector: 'tabs-tab-group',
  styleUrl: './tab-group.scss',
  templateUrl: './tab-group.html',
})
export class TabGroup {
  tab = contentChild(Tab);
  toggleTab = computed(() => this.tab()?.disabled());
  tabs = contentChildren(Tab);

  constructor() {
    effect(() => {
      console.log('tabs:', this.tabs());
    });
  }
}
