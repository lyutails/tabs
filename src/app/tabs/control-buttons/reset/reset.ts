import { Component, input } from '@angular/core';

@Component({
  selector: 'button[tabs-reset]',
  styleUrl: './reset.scss',
  templateUrl: './reset.html',
  imports: [],
})

export class Reset {
  public buttonName = input<string, string>('', { transform: upperCase });
}

function upperCase(value: string): string {
  return value?.toUpperCase() ?? '';
}