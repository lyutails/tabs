import { Component, contentChild, contentChildren, signal, output, ElementRef, inject } from '@angular/core';
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
  protected editIndex = signal<number | null>(null);
  protected tab = contentChild(Tab, { read: ElementRef });
  protected tabs = contentChildren(Tab);

  ngAfterContentInit() {
    const el = this.tab()?.nativeElement;
    if (el) {
      el.classList.add('first-initial-tab');
    }
  }

  clickEdit(event: MouseEvent, index: number, input: HTMLInputElement): void {
    this.editIndex.update((currentIndex) => {
      return currentIndex === index ? null : index
    })
    this.tabs()[index].title.set(input.value);
    event.stopPropagation();
  }
}
