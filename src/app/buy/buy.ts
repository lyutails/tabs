import { Component, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { BuyStore } from './store/buy-store';
import { FormatPricePipe } from './pipes/format-price-pipe';
import { form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { MatError, MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CheckoutData } from './models/buy.model';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '../core/utils/dialog/dialog';

@Component({
  imports: [FormatPricePipe, FormField, MatError, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  selector: 'tabs-buy',
  styleUrl: './buy.scss',
  templateUrl: './buy.html',
})
export class Buy {
  buyStore = inject(BuyStore);
  buyModel = signal<CheckoutData>({
    cardNumber: '',
    name: '',
    surname: '',
    validTill: '',
    cvv: '',
  })
  buyForm = form(this.buyModel, (schemaPath) => {
    required(schemaPath.cardNumber, { message: 'required' });
    maxLength(schemaPath.cardNumber, 19, { message: 'invalid length' });
    minLength(schemaPath.cardNumber, 19, { message: 'invalid length' });
    required(schemaPath.name, { message: 'required' });
    required(schemaPath.surname, { message: 'required' });
    required(schemaPath.validTill, { message: 'required' });
    maxLength(schemaPath.validTill, 5, { message: 'format MM/YY' });
    required(schemaPath.cvv, { message: 'required' });
    maxLength(schemaPath.cvv, 3, { message: 'required 3 digits' });
    minLength(schemaPath.cvv, 3, { message: 'required 3 digits' })
  });
  position = 0;
  products = viewChild<ElementRef>('products');
  layout = input<'default' | 'side' | 'search'>('default');
  readonly dialog = inject(MatDialog);
  purchaseMessage = 'We start working on it, the details and the receipt are sent to your email. 💖';
  customerName = '';

  buy(): void {
    if (this.buyForm().invalid()) {
      this.buyForm().markAsTouched();
      return;
    } else {
      this.customerName = this.buyModel().name;
      const dialogRef = this.dialog.open(Dialog, {
        data: {
          message: this.purchaseMessage,
          name: this.customerName
        }
      });
    }

    const checkoutData = this.buyModel();
  }

  onValidTillChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    input.value = value;
    this.buyModel.update(model => ({
      ...model,
      validTill: value
    }));
  }

  onValidCardNumberChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value
      .replace(/\D/g, '')
      .slice(0, 19);
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    input.value = value;
    this.buyModel.update(model => ({
      ...model,
      cardNumber: value
    }));
  }

  removeAllFromCart() {
    this.buyStore.removeAllFromCart();
  }


  moveRight() {
    this.position -= 100;
  }

  moveLeft() {
    this.position += 100;
  }

  get canMoveLeft() {
    return this.position < 0;
  }

  get canMoveRight() {
    const element = this.products()?.nativeElement;
    const container = element?.parentElement;

    if (!element || !container) return false;

    return this.position < element.scrollWidth - container.clientWidth;
  }
}
