import { ElementRef } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { FormErrors } from './interface/errors';
export const renderErrorsFromBackend = (
  errors: FormErrors,
  errorContainer: ElementRef,
  render: Renderer2
) => {
  // Remove old errors
  removeChildrenElement(errorContainer, render);
  // Render new errors
  for (let error of Object.values(errors)) {
    let errorEle = render.createElement('p');
    let errorText = render.createText(error);
    render.appendChild(errorEle, errorText);
    render.appendChild(errorContainer.nativeElement, errorEle);
  }
};
export const removeChildrenElement = (el: ElementRef, render: Renderer2) => {
  Array.from(el.nativeElement.children).forEach((child) => {
    render.removeChild(el.nativeElement, child);
  });
};
