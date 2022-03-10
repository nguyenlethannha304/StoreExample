import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { viewNameObject } from './viewName';

@Injectable({
  providedIn: 'root',
})
export class NavigateService {
  //Service allow navigate website via constant name in viewNameObject
  constructor(private route: Router) {}
  navigateTo(viewName: string) {
    let url = this.getUrlFromName(viewName);
    this.route.navigate([url]);
  }
  getUrlFromName = (viewName: string): string | null => {
    let viewNameArray = viewName.split(':');
    let viewNameObjectLoop: any = viewNameObject;
    let url = '';
    for (let name of viewNameArray) {
      if (viewNameObjectLoop['name'] !== undefined) {
        url = this.mergeURLPart(url, viewNameObjectLoop['name']);
      }
      viewNameObjectLoop =
        viewNameObjectLoop[name as keyof typeof viewNameObjectLoop];
    }
    if (typeof viewNameObjectLoop == 'string') {
      url = this.mergeURLPart(url, viewNameObjectLoop);
    } else {
      throw new Error(`Can't merge ${url} and ${viewNameObjectLoop}`);
    }
    return url;
  };
  mergeURLPart = (url1: string, url2: string): string => {
    // automatically add slash betweeen url parts
    return url1 + '/' + url2;
  };
}
