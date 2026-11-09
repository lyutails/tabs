import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPrice',
})
export class FormatPricePipe implements PipeTransform {
  transform(value: string | undefined, ...args: unknown[]): unknown {
    return value?.replace(/&nbsp;/g, ' ');
  }
}
