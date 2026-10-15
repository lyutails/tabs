import { Component, inject, input } from '@angular/core';
import { ModalState } from '../modal-state';
import { FormatPricePipe } from '../../buy/pipes/format-price-pipe';

@Component({
  imports: [FormatPricePipe],
  selector: 'tabs-products-modal',
  styleUrl: './products-modal.scss',
  templateUrl: './products-modal.html',
})
export class ProductsModal {
  brandName = input<string>();
  name = input<string>();
  image = input<string>();
  price = input<string>();
  modalStateService = inject(ModalState);

  closeModal(): void {
    this.modalStateService.isOpenModal.set(false);
  }
}
