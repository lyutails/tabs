import { Component, inject, signal } from '@angular/core';
import { BuyStore } from './store/buy-store';
import { FormatPricePipe } from './pipes/format-price-pipe';
import { form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { MatError, MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

interface CheckoutData {
  cardNumber: string;
  name: string;
  surname: string;
  validTill: string;
  cvv: string;
}

@Component({
  imports: [FormatPricePipe, FormField, MatError, FormsModule, MatFormFieldModule, MatInputModule],
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
    required(schemaPath.cardNumber);
    required(schemaPath.name);
    required(schemaPath.surname);
    required(schemaPath.validTill);
    required(schemaPath.cvv);
    maxLength(schemaPath.cvv, 3, { message: 'cvv should be 3 digits long' });
    minLength(schemaPath.cvv, 3, { message: 'cvv should be 3 digits long' })
  });
}
