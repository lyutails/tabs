import { Component, inject, input } from '@angular/core';
import { Price } from '../../../../scripts/catalog-importer/catalog-importer.model';
import { ModalState } from '../modal-state';

@Component({
  imports: [],
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
