import { Component, inject, input, isSignal, output, signal } from '@angular/core';
import { Reset } from '../reset/reset';
import { UpperCasePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Tab } from '../tab/tab';
import { Router } from '@angular/router';
import { TabsState } from '../tabs/services/tabs-state';

@Component({
  imports: [Reset, UpperCasePipe,],
  selector: 'tabs-control-buttons',
  styleUrl: './control-buttons.scss',
  templateUrl: './control-buttons.html',
})
export class ControlButtons {
  protected resetName = output<string>();
  protected resetButtonName = signal<string>('');
  protected snackBar = inject(MatSnackBar);
  protected setSizeButtonName = 'Set default titles size';
  protected router = inject(Router);
  protected addTabState = signal<boolean>(true);
  private tabsStateService = inject(TabsState);
  protected tabTitles = this.tabsStateService.tabTitles;
  protected defaultTabsTitleSize = this.tabsStateService.defaultTabsTitleSize;
  protected disabledSingleState = this.tabsStateService.disabledSingleState;
  protected tabTextarea = this.tabsStateService.tabTextarea;

  ngOnInit() {
    this.setResetButtonName();
  }

  setResetButtonName(): void {
    this.resetName.emit('Reset names');
  }

  resetNames(): void {
    this.tabsStateService.tabTitles.update((titles) =>
      titles.map((title, i) => 'Tab ' + (i + 1))
    );

    const snackBarRef = this.snackBar.open('Reset completed', '💃', { duration: 5000 });
    snackBarRef.onAction().subscribe(() => {
      this.snackBar.open(`New names: ${this.tabsStateService.tabTitles()}`, 'ok', { duration: 5000 })
    })
  }

  openEditor(): void {
    this.router.navigate(['/editor']);
  }

  addDeleteTab(): void {
    if (this.tabTitles.length === 4) {
      this.tabsStateService.addNewTab();
      this.defaultTabsTitleSize.update((sizes) => [...sizes, 25]);
      this.disabledSingleState.update((states) => [...states, true]);
      this.tabsStateService.tabOrderName.push('fifth');
      this.tabTextarea.update((texts) => [...texts, ''])
      this.addTabState.set(false);
    } else {
      {
        this.tabTitles.update((titles) => {
          const newTitles = [...titles];
          newTitles.pop();
          return newTitles;
        });
        this.defaultTabsTitleSize.update((sizes) => {
          sizes.pop();
          return sizes;
        });
        this.disabledSingleState.update((states) => {
          states.pop();
          return states;
        });
        this.tabsStateService.tabOrderName.pop();
        this.tabTextarea.update((texts) => texts.slice(0, -1))
        this.addTabState.set(true);
      }
    }
  }

  setDefaultTabTitlesSize(): void {
    this.defaultTabsTitleSize.update((sizes) =>
      sizes.map((size) => size = 25));
  }
}
