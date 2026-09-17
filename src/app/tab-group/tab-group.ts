import { Component, computed, contentChild, contentChildren, effect } from '@angular/core';
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
      this.tabs().forEach((tab, indes) => {
        console.log(tab.title());
      })
    });
  }
}
