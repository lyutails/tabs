import { Component, contentChild, contentChildren, signal, OnInit, output, ElementRef, inject } from '@angular/core';
import { Tab } from '../tab/tab';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  selector: 'tabs-tab-group',
  styleUrl: './tab-group.scss',
  templateUrl: './tab-group.html',
})
export class TabGroup implements OnInit {
  protected tab = contentChild(Tab, { read: ElementRef });
  protected tabs = contentChildren(Tab);
  protected editIndex = signal<number | null>(null);
  protected resetName = output<string>();
  protected snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.setResetButtonName();
  }

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

  setResetButtonName(): void {
    this.resetName.emit('Reset names');
  }

  resetNames(): void {
    this.tabs().forEach((tab, i) => {
      tab.title.set('Tab ' + (i + 1));
    });

    const snackBarRef = this.snackBar.open('Reset completed', '💃', { duration: 5000 });
    snackBarRef.onAction().subscribe(() => {
      this.snackBar.open(`New names: ${this.tabs().map((tab) => tab.title())}`, 'ok', {duration: 5000})
    })
  }
}
