import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency',
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    // Transform number 1000000 to 1.000.000đ
    let numberString = value.toLocaleString('de-DE');
    return `${numberString}đ`;
  }
}
