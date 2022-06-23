import { ElementRef, Renderer2 } from '@angular/core';
export const positionIconIntoElement = (
  Element: HTMLElement,
  iconContainer: HTMLElement,
  side: string = 'right'
) => {
  let sides = side.split(' ');
  //This function is called afterViewInit
  //iconContainer must be absolute position before ViewInit (prevent it taking space during rendering)
  Element.style['position'] = 'relative';
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
export const renderIconToView = (
  render: Renderer2,
  ...args: iconRenderObject[]
) => {
  for (let iconRenderObject of args) {
    if (iconRenderObject.iconContainer instanceof ElementRef) {
      iconRenderObject.iconContainer =
        iconRenderObject.iconContainer.nativeElement;
    }
    render.setProperty(
      iconRenderObject.iconContainer,
      'innerHTML',
      iconRenderObject.icon
    );
  }
};

export type iconRenderObject = {
  icon: string;
  iconContainer: ElementRef | HTMLDivElement;
};
