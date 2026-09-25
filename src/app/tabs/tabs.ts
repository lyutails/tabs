import { Component, signal, viewChild } from '@angular/core';
import { TabGroup } from '../tab-group/tab-group';
import { Tab } from '../tab/tab';
import { CommonModule, NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { ActiveContent } from '../active-content/active-content';
import { MatIconModule } from '@angular/material/icon';
import { Reset } from '../reset/reset';

@Component({
  imports: [TabGroup, Tab, CommonModule, ActiveContent, MatIconModule,
    NgTemplateOutlet, Reset, UpperCasePipe],
  selector: 'tabs-tabs',
  styleUrl: './tabs.scss',
  templateUrl: './tabs.html',
})
export class Tabs {
  protected title = signal('tabs');
  protected tab = 'initial tab';
  protected tabTitles: string[] = ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4'];
  protected disabledAllState = signal<boolean>(false);
  protected buttonName: 'activate disabled' | 'deactivate enabled' = 'deactivate enabled';
  protected disabledSingleState = signal<boolean[]>(Array(this.tabTitles.length).fill(true));
  protected tabOrderName: string[] = ['first', 'second', 'third', 'fourth'];
  protected activeTab = signal<number>(0);
  protected resetButtonName = signal<string>('');
  protected defaultTabsTitleSize = signal<number[]>(Array(this.tabTitles.length).fill(25));
  protected setSizeButtonName = 'Set default titles size';
  protected tabGroup = viewChild(TabGroup);
  protected addTabState = signal<boolean>(true);
  protected tabTextarea = signal<string[]>(Array(this.tabTitles.length).fill(''));

  ngOnInit(): void {
    this.disabledSingleState()[1] = false;
    this.activeTab.update(() => this.disabledSingleState().indexOf(true));
  }

  toggleAllTabs(): void {
    if (this.disabledAllState() === true) {
      this.disabledAllState.set(false);
      this.buttonName = 'deactivate enabled';
      this.disabledSingleState.set(Array(this.tabTitles.length).fill(true));
    } else {
      this.disabledAllState.set(true);
      this.buttonName = 'activate disabled';
      this.disabledSingleState.set(Array(this.tabTitles.length).fill(false));
    }
  }

  toggleSingleTab(index: number): void {
    event?.stopPropagation();
    this.disabledSingleState.update((states) =>
      states.map((state, i) => i === index ? !state : state))
  }

  activateTab(index: number): void {
    if (this.disabledSingleState()[index] === true) {
      this.activeTab.set(index);
    }
  }

  getResetButtonName(value: string): void {
    this.resetButtonName.set(value);
  }

  setDefaultTabTitlesSize(): void {
    this.defaultTabsTitleSize.update((sizes) =>
      sizes.map((size) => size = 25));
  }

  addDeleteTab(): void {
    if (this.tabTitles.length === 4) {
      this.tabTitles.push('Tab 5');
      this.defaultTabsTitleSize.update((sizes) => [...sizes, 25]);
      this.disabledSingleState.update((states) => [...states, true]);
      this.tabOrderName.push('fifth');
      this.tabTextarea.update((texts) => [...texts, ''])
      this.addTabState.set(false);
    } else {
      {
        this.tabTitles.pop();
        this.defaultTabsTitleSize.update((sizes) => {
          sizes.pop();
          return sizes;
        });
        this.disabledSingleState.update((states) => {
          states.pop();
          return states;
        });
        this.tabOrderName.pop();
        this.tabTextarea.update((texts) => texts.slice(0, -1))
        this.addTabState.set(true);
      }
    }
  }

  updateTabTextarea(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const index = this.activeTab();

    this.tabTextarea.update((texts) => {
      const newTexts = [...texts];
      newTexts[index] = textarea.value;

      return newTexts;
    })
  }

  resetNames(): void {
    this.tabGroup()?.resetNames()
  }
}
