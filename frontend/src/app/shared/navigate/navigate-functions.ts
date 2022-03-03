import { Router } from '@angular/router';
import { viewNameObject } from './viewName';
// Function allows get URL via the constant names in viewNameObject
export const getUrlFromName = (viewName: string): string | null => {
  let viewNameArray = viewName.split(':');
  let viewNameObjectLoop: any = viewNameObject;
  let url = '';
  for (let name in viewNameArray) {
    if (viewNameObjectLoop['name'] !== undefined) {
      url = mergeURLPart(url, viewNameObjectLoop['name']);
    }
    viewNameObjectLoop =
      viewNameObjectLoop[name as keyof typeof viewNameObjectLoop];
  }
  if (typeof viewNameObjectLoop == 'string') {
    url = mergeURLPart(url, viewNameObjectLoop);
  } else {
    throw new Error(`Can't merge ${url} and ${viewNameObjectLoop}`);
  }
  return url;
};
const mergeURLPart = (url1: string, url2: string): string => {
  // automatically add slash betweeen url parts
  return url1 + '/' + url2;
};
