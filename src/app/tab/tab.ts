import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'tabs-tab',
  styleUrl: './tab.scss',
  templateUrl: './tab.html',
})
export class Tab {
  label = input.required<string>();
  disabled = input(false);
  title = input.required<string>();
  active = input<boolean>(false);
}
