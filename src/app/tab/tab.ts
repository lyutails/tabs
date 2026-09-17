import { Component, input, model } from '@angular/core';

@Component({
  imports: [],
  selector: 'tabs-tab',
  styleUrl: './tab.scss',
  templateUrl: './tab.html',
})
export class Tab {
  label = input.required<string>();
  disabled = input(false);
  title = model.required<string>();
  active = input<boolean>(false);
}
