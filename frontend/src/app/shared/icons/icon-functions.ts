import { ElementRef } from '@angular/core';
export const positionIconIntoElement = (
  targetElement: HTMLElement,
  iconContainer: HTMLElement,
  side: string = 'right'
) => {
  let sides = side.split(' ');
  //This function is called afterViewInit
  //iconContainer must be absolute position before ViewInit (prevent it taking space during rendering)
  targetElement.style['position'] = 'relative';
  iconContainer.style['position'] = 'absolute';
  for (let side of sides) {
    if (side == 'bottom' || side == 'top') {
      iconContainer.style[side] = '0';
    }
    if (side == 'right' || side == 'left') {
      iconContainer.style[side] = `0.5rem`;
    }
  }
};
export const resizeIcon = (
  iconContainerRef: ElementRef,
  size: string = '1.5rem' //24px
) => {
  let icon = iconContainerRef.nativeElement.querySelector('svg');
  icon.style['width'] = icon.style['height'] = size;
};
