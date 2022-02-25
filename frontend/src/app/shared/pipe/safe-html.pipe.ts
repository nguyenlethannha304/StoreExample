import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
/* bypassSecurityTrustHtml if it is an icon and not contain any "<script></script>" or "href=" */
@Pipe({
  name: 'safeIconHTML',
})
export class SafeIconHTMLPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: string): SafeHtml | null {
    if (this.isValid(value)) {
      return this.sanitizer.bypassSecurityTrustHtml(value);
    }
    return null;
  }
  isValid(value: string): boolean {
    if (
      this.isSVGtag(value) &&
      !this.isHrefIn(value) &&
      !this.isScriptTagIn(value)
    ) {
      return true;
    }
    return false;
  }
  isScriptTagIn(value: string): boolean {
    if (value.includes('<script') || value.includes('</script>')) {
      return true;
    }
    return false;
  }
  isHrefIn(value: string): boolean {
    if (value.includes('href=')) {
      return true;
    }
    return false;
  }
  isSVGtag(value: string): boolean {
    if (value.startsWith('<svg') && value.endsWith('</svg>')) {
      return true;
    }
    return false;
  }
}
