import { ElementRef } from '@angular/core';
export const positionIconIntoElement = (
  targetElement: HTMLElement,
  iconContainer: HTMLElement,
  side: string = 'right'
) => {
  //This function is called afterViewInit
  //iconContainer must be absolute position before ViewInit (prevent it taking space during rendering)
  if (iconContainer.style['position'] != 'absolute') {
    throw Error(`${iconContainer} must be absolute position`);
  }
  let targetPositionInfo: DOMRect = targetElement.getBoundingClientRect();
  let screenWidth: number = window.innerWidth;
  iconContainer.style['top'] = `${targetPositionInfo.top}px`;
  if (side == 'right') {
    iconContainer.style['right'] = `${
      screenWidth - targetPositionInfo.right + 8
    }px`;
  }
};
export const resizeIcon = (
  iconContainerRef: ElementRef,
  size: string = '1.5rem' //24px
) => {
  let icon = iconContainerRef.nativeElement.querySelector('svg');
  icon.style['width'] = icon.style['height'] = size;
};
