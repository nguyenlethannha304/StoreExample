import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  innerWidth: number;
  defaultValueObject = {
    0: '80%',
  };
  defaultBreakpoint: number; //Determine the breakpoint for all icons
  constructor() {
    this.innerWidth = window.innerWidth;
    this.defaultBreakpoint = this.getBreakpoint(); //Create breakpoint for all usage except new valueObject is given
  }
  getBreakpoint(valueObject: Object = this.defaultValueObject): number {
    let rv = 0;
    for (const [key, value] of Object.entries(valueObject)) {
      let breakpoint = parseInt(key);
      if (this.innerWidth >= breakpoint) {
        rv = breakpoint;
      } else {
        break;
      }
    }
    return rv;
  }
  getIconValue(valueObject: Object = this.defaultValueObject) {
    let breakpoint = this.defaultBreakpoint;
    if (valueObject !== this.defaultValueObject) {
      //The case not use default value from defaultValueObject (1st parameter is passed to)
      breakpoint = this.getBreakpoint(valueObject);
    }
    return valueObject[breakpoint.toString() as keyof typeof valueObject];
  }
}
