import { Component, inject, signal, viewChild } from '@angular/core';
import { TabGroup } from './tab-group/tab-group';
import { Tab } from './tab/tab';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ActiveContent } from './active-content/active-content';
import { MatIconModule } from '@angular/material/icon';
import { ControlButtons } from './control-buttons/control-buttons';
import { TabsState } from './services/tabs-state';
import { Router } from '@angular/router';

@Component({
  imports: [TabGroup, Tab, CommonModule, ActiveContent, MatIconModule,
    NgTemplateOutlet, ControlButtons],
  selector: 'tabs-tabs',
  styleUrl: './tabs.scss',
  templateUrl: './tabs.html',
})
export class Tabs {
  protected title = signal('tabs');
  protected tab = 'initial tab';
  protected tabLabels = ['What you wanna?', 'Searched and found', 'Drag here wanted', 'About you'];
  protected newTab = 'New tab';
  protected buttonName: 'activate disabled' | 'deactivate enabled' = 'deactivate enabled';
  protected tabGroup = viewChild(TabGroup);
  protected router = inject(Router);
  tabsStateService = inject(TabsState);
  protected disabledSingleState = this.tabsStateService.disabledSingleState;
  protected defaultTabsTitleSize = this.tabsStateService.defaultTabsTitleSize;
  protected tabOrderName = this.tabsStateService.tabOrderName;
  protected disabledAllState = this.tabsStateService.disabledAllState;

  ngOnInit(): void {
    this.disabledSingleState()[2] = false;
    this.tabsStateService.activeTab.update(() => this.disabledSingleState().indexOf(true));
  }

  toggleAllTabs(): void {
    if (this.disabledAllState() === true) {
      this.disabledAllState.set(false);
      this.buttonName = 'deactivate enabled';
      this.disabledSingleState.set(Array(this.tabsStateService.tabTitles().length).fill(true));
    } else {
      this.disabledAllState.set(true);
      this.buttonName = 'activate disabled';
      this.disabledSingleState.set(Array(this.tabsStateService.tabTitles().length).fill(false));
    }
  }

  toggleSingleTab(index: number): void {
    event?.stopPropagation();
    this.disabledSingleState.update((states) =>
      states.map((state, i) => i === index ? !state : state))
  }

  activateTab(index: number): void {
    if (this.disabledSingleState()[index] === true) {
      this.tabsStateService.activeTab.set(index);
    }
  }

  updateTabTextarea(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const index = this.tabsStateService.activeTab();

    this.tabsStateService.tabTextarea.update((texts) => {
      const newTexts = [...texts];
      newTexts[index] = textarea.value;

      return newTexts;
    })
  }

  setTabTitleSize(i: number, size: number): void {
    this.defaultTabsTitleSize.update((sizes) => {
      const newSizes = [...sizes];
      newSizes[i] = size;
      return newSizes;
    })
  }

  navigate(index: number): void {
    switch (index) {
      case 0:
        this.router.navigate(['search']);
        break;
      case 1:
        this.router.navigate(['found']);
        break;
      case 2:
        this.router.navigate(['buy']);
        break;
      case 3:
        this.router.navigate(['profile']);
        break;
      default:
        this.router.navigate(['']);
    }
  }
}
