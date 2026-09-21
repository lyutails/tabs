import { Component, OnInit, signal, SimpleChanges, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Tab } from './tab/tab';
import { TabGroup } from './tab-group/tab-group';
import { CommonModule, NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { ActiveContent } from './active-content/active-content';
import { MatIconModule } from '@angular/material/icon';
import { TitleHighlight } from './directives/title-highlight/title-highlight';
import { Reset } from './reset/reset';

@Component({
  selector: 'tabs-root',
  imports: [RouterOutlet, TabGroup, Tab, CommonModule, ActiveContent, MatIconModule,
    NgTemplateOutlet, TitleHighlight, Reset, UpperCasePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: {
    '[class.dark]': "theme() === 'dark'"
  }
})
export class App implements OnInit {
  title = signal('tabs');
  tab = 'initial tab';
  tabTitles: string[] = ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4'];
  disabledAllState = signal<boolean>(false);
  buttonName: 'activate disabled' | 'deactivate enabled' = 'deactivate enabled';
  disabledSingleState = signal<boolean[]>(Array(this.tabTitles.length).fill(true));
  tabOrderName: string[] = ['first', 'second', 'third', 'fourth'];
  activeTab = signal<number>(0);
  theme = signal<'dark' | 'light'>('light');
  resetButtonName = signal<string>('');
  defaultTabsTitleSize = signal<number[]>(Array(this.tabTitles.length).fill(25));
  setSizeButtonName = 'Set default titles size';
  tabGroup = viewChild(TabGroup);

  ngOnInit(): void {
    this.disabledSingleState()[1] = false;
    this.activeTab.update(() => this.disabledSingleState().indexOf(true));
    document.fonts.load('24px "Material Symbols Outlined"').then(() => {
      document.body.classList.add('material-icons-loaded');
    });
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

  toggleTheme(): void {
    if (this.theme() === 'light') {
      this.theme.set('dark');
    } else {
      this.theme.set('light');
    }
  }

  getResetButtonName(value: string): void {
    this.resetButtonName.set(value);
  }

  setDefaultTabTitlesSize(): void {
    this.defaultTabsTitleSize.update((sizes) =>
      sizes.map((size) => size = 25));
  }

  addTab(): void {
    if (this.tabTitles.length === 4) {
      this.tabTitles.push('Tab 5');
      this.defaultTabsTitleSize.update((sizes) => [...sizes, 25]);
      this.disabledSingleState.update((states) => [...states, true]);
      this.tabOrderName.push('fifth');
    }
  }

  resetNames() {
    this.tabGroup()?.resetNames()
  }
}
