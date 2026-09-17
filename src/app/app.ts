import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Tab } from './tab/tab';
import { TabGroup } from './tab-group/tab-group';
import { CommonModule } from '@angular/common';
import { ActiveContent } from './active-content/active-content';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'tabs-root',
  imports: [RouterOutlet, TabGroup, Tab, CommonModule, ActiveContent, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: {
    '[class.dark]': "theme() === 'dark'"
  }
})
export class App implements OnInit {
  title = signal('tabs');
  tab = 'new tab';
  tabTitles: string[] = ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4'];
  disabledAllState = signal<boolean>(false);
  buttonName: 'activate disabled' | 'deactivate enabled' = 'deactivate enabled';
  disabledSingleState = signal<boolean[]>(Array(this.tabTitles.length).fill(true));
  tabOrderName: string[] = ['first', 'second', 'third', 'fourth'];
  activeTab = signal<number>(0);
  theme = signal<'dark' | 'light'>('light');

  ngOnInit() {
    this.disabledSingleState()[1] = false;
    this.activeTab.update(() => this.disabledSingleState().indexOf(true));
    document.fonts.load('24px "Material Symbols Outlined"').then(() => {
      document.body.classList.add('material-icons-loaded');
    });
  }

  toggleAllTabs() {
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

  toggleSingleTab(index: number) {
    event?.stopPropagation();
    this.disabledSingleState.update((states) =>
      states.map((state, i) => i === index ? !state : state))
  }

  activateTab(index: number) {
    if (this.disabledSingleState()[index] === true) {
      this.activeTab.set(index);
    }
  }

  toggleTheme() {
    if (this.theme() === 'light') {
      this.theme.set('dark');
    } else {
      this.theme.set('light');
    }
  }
}
