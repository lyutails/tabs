import { Component, computed, contentChild, contentChildren, signal, OnInit } from '@angular/core';
import { Tab } from '../tab/tab';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  selector: 'tabs-tab-group',
  styleUrl: './tab-group.scss',
  templateUrl: './tab-group.html',
})
export class TabGroup {
  tab = contentChild(Tab);
  toggleTab = computed(() => this.tab()?.disabled());
  tabs = contentChildren(Tab);
  tabsNames = signal<string[]>([]);
  editIndex = signal<number | null>(null);

  getTabsNames() {
    this.tabs().forEach((tab) => {
      if (tab) {
        this.tabsNames.update((names) => [...names, tab.title()]);
      }
    })
  }

  clickEdit(event: MouseEvent, index: number, input: HTMLInputElement) {
    this.editIndex.update((currentIndex) => {
      return currentIndex === index ? null : index
    })
    this.tabs()[index].title.set(input.value);
    event.stopPropagation();
  }
}
