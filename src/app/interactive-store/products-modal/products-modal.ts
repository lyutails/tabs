import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'tabs-products-modal',
  styleUrl: './products-modal.scss',
  templateUrl: './products-modal.html',
})
export class ProductsModal {
  brandName = input<string>();
}
