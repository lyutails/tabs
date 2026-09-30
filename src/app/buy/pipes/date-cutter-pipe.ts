import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateCutter',
})
export class DateCutterPipe implements PipeTransform {
  transform(value: string): string {
    return value.slice(0, 3);
  }
}
