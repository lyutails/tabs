import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'tabs-search-item',
  styleUrl: './search-item.scss',
  templateUrl: './search-item.html',
})
export class SearchItem {
  brandName = input<string>('');
  imgSrc = input<string>('');
  itemName = input<string>('');
  price = input<string>('');
}
