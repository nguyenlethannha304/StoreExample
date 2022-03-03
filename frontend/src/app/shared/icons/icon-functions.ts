import { ElementRef } from '@angular/core';
export const positionIconToSideContainer = (
  container: ElementRef,
  icon: ElementRef,
  side: string = 'right',
  distance: string = '1rem'
) => {
  let containerElement = container.nativeElement;
  let iconElement = icon.nativeElement;
  iconElement.style[side] = distance;
};
export const resizeIcon = (
  iconContainerRef: ElementRef,
  size: string = '1.5rem' //24px
) => {
  let icon = iconContainerRef.nativeElement.querySelector('svg');
  icon.style['width'] = icon.style['height'] = size;
};
