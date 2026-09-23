import { Component, input, model } from '@angular/core';

@Component({
  imports: [],
  selector: 'tabs-tab',
  styleUrl: './tab.scss',
  templateUrl: './tab.html',
  host: {
    '[class.tab_background-color]': 'sizeTitle() % 10 === 0',
  }
})
export class Tab {
  label = input.required<string>();
  disabled = input(false);
  title = model.required<string>();
  active = input<boolean>(false);
  sizeTitle = model(20);

  increaseSize() {
    this.sizeTitle.update((previousSize) => previousSize + 1);
    event?.stopPropagation();
  }

  decreaseSize() {
    if (this.sizeTitle() > 10) {
      this.sizeTitle.update((previousSize) => previousSize - 1);
    }
    event?.stopPropagation();
  }
}
