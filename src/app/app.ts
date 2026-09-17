import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Tab } from './tab/tab';
import { TabGroup } from './tab-group/tab-group';

@Component({
  selector: 'tabs-root',
  imports: [RouterOutlet, TabGroup, Tab],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  title = signal('tabs');
  tab = 'new tab';
  tabTitles: string[] = ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4'];
  disabledAllState = signal<boolean>(false);
  buttonName: 'activate' | 'deactivate' = 'deactivate';
  disabledSingleState = signal<boolean[]>(Array(this.tabTitles.length).fill(true));
  tabOrderName: string[] = ['first', 'second', 'third', 'fourth'];

  ngOnInit() {
    this.disabledSingleState()[1] = false;
  }

  toggleAllTabs() {
    if (this.disabledAllState() === true) {
      this.disabledAllState.set(false);
      this.buttonName = 'deactivate';
      this.disabledSingleState.set(Array(this.tabTitles.length).fill(true));
    } else {
      this.disabledAllState.set(true);
      this.buttonName = 'activate';
      this.disabledSingleState.set(Array(this.tabTitles.length).fill(false));
    }
  }

  toggleSingleTab(index: number) {
    this.disabledSingleState.update((states) =>
      states.map((state, i) => i === index ? !state : state))
  }
}
