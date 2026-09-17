import { Component, computed, contentChild, contentChildren, signal, OnInit } from '@angular/core';
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
  tabsNames = signal<string[]>([]);

  getTabsNames() {
    this.tabs().forEach((tab, index) => {
      if (tab) {
        this.tabsNames.update((names) => [...names, tab.title()]);
      }
    })
  }
}
