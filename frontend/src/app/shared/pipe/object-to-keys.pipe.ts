import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectToKeys',
})
export class ObjectToKeysPipe implements PipeTransform {
  transform(value: Object): Array<string> {
    if (!value) {
      return [];
    }
    return Object.keys(value);
  }
}
