import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPrice',
})
export class FormatPricePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return value.replace(/&nbsp;/g, ' ');
  }
}
