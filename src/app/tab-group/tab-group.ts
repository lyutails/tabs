import { Component, computed, contentChild } from '@angular/core';
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

  getEnabledTabs() {
    return;
  }

  activateFirstEnabledTab() {
    return;
  }
}
