import { Component, computed, contentChild, contentChildren, signal, OnInit, output, model } from '@angular/core';
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
  tabs = contentChildren(Tab);
  editIndex = signal<number | null>(null);
  resetName = output<string>();

  ngOnInit() {
    this.setResetButtonName();
  }

  clickEdit(event: MouseEvent, index: number, input: HTMLInputElement): void {
    this.editIndex.update((currentIndex) => {
      return currentIndex === index ? null : index
    })
    this.tabs()[index].title.set(input.value);
    event.stopPropagation();
  }

  setResetButtonName(): void {
    this.resetName.emit('Reset names');
  }

  resetNames(): void {
    this.tabs().forEach((tab, i) => {
      tab.title.set('Tab ' + (i + 1));
    });
  }
}
