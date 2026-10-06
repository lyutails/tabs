import { Component, input, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'tabs-active-content',
  styleUrl: './active-content.scss',
  templateUrl: './active-content.html',
})
export class ActiveContent {
  index = input<number>();
  active = signal<boolean>(false);

  activate() {
    this.active.set(false);

    requestAnimationFrame(() => {
      this.active.set(true);
    });
  }
}
