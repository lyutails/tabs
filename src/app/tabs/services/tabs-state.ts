import { Service, signal } from '@angular/core';
import { Tab } from '../../tab/tab';

@Service()
export class TabsState {
    protected newTab = 'New tab';
    tabTitles = signal<string[]>(['Profile', 'Plans', this.newTab, this.newTab]);
    defaultTabsTitleSize = signal<number[]>(Array(this.tabTitles().length).fill(25));
    disabledSingleState = signal<boolean[]>(Array(this.tabTitles().length).fill(true));
    tabOrderName: string[] = ['first', 'second', 'third', 'fourth'];
    tabTextarea = signal<string[]>(Array(this.tabTitles().length).fill(''));
    disabledAllState = signal<boolean>(false);
    tabs: readonly Tab[] = [];

    addNewTab(): void {
        this.tabTitles.update((titles) => [...titles, this.newTab]) ;
    }

    getTabs(tabsArray: Tab[]): void {
        this.tabs = [...tabsArray];
    }
}
