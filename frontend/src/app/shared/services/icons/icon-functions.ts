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
  iconString: string,
  parentElement: HTMLElement,
  render: Renderer2
) => {
  let icon = new CreateIcon(iconString, render).process();
  render.appendChild(parentElement, icon);
};

const ATTRIBUTE_VALUE_REGREX = /(\w)+=\"(.)+?\"/g;
const TagSignalRegrex = /<\/|\/>|<|>/g;
class CreateIcon {
  // new CreateIcon(iconString, render).process() => svgElement
  preCursor: number = 0;
  curCursor: number = 0;
  svgElement: HTMLElement;
  trackingOpening: Array<string> = [];
  elementArray: Array<unknown> = [];
  constructor(private iconString: string, private render: Renderer2) {
    this.svgElement = this.render.createElement('svg', 'svg');
    this.trackingOpening.push('svg');
    this.elementArray.push(this.svgElement);
    this.firstStep();
  }
  get elementArrayLength() {
    return this.elementArray.length;
  }
  firstStep() {
    this.curCursor = this.iconString.search('>');
    let attributeString = this.iconString.slice(this.preCursor, this.curCursor);
    this.assignAttributeForElement(this.svgElement, attributeString);
  }
  process(): HTMLElement {
    this.firstStep();
    while (this.curCursor + 1 < this.iconString.length) {
      this.preCursor = this.curCursor + 1;
      let newString = this.iconString.slice(this.preCursor);
      this.curCursor = newString.search('>') + this.preCursor;
      if (this.iconString.slice(this.preCursor, this.preCursor + 2) == '</') {
        this.process_closing_tag();
      } else {
        this.process_opening_tag();
      }
    }
    return this.svgElement;
  }
  process_opening_tag() {
    let newString = this.iconString.slice(this.preCursor);
    let elementName = newString.match(/^<\w+/)[0].slice(1);
    let element = this.render.createElement(`${elementName}`, 'svg');
    let attributeString = this.iconString.slice(this.preCursor, this.curCursor);
    this.assignAttributeForElement(element, attributeString);
    this.render.appendChild(
      this.elementArray[this.elementArrayLength - 1],
      element
    );
    if (!this.is_self_tag()) {
      this.trackingOpening.push(`${elementName}`);
      this.elementArray.push(element);
    }
  }
  process_closing_tag() {
    let elementName = this.iconString.slice(this.preCursor + 2, this.curCursor);
    if (elementName == this.trackingOpening[this.elementArrayLength - 1]) {
      this.trackingOpening.pop();
      this.elementArray.pop();
    } else {
      throw `Process_closing_tag_error: ${elementName} != ${
        this.trackingOpening[this.elementArrayLength - 1]
      }`;
    }
  }
  assignAttributeForElement(element: HTMLElement, attributeString: string) {
    let attributeArray = attributeString.match(ATTRIBUTE_VALUE_REGREX);
    if (attributeArray !== null) {
      for (let item of attributeArray) {
        let attributeValue = item.split('=');
        let attribute = attributeValue[0];
        let value = attributeValue[1].slice(1, attributeValue[1].length - 1); //Remove "" both sides
        this.render.setAttribute(element, attribute, value);
      }
    }
  }
  is_self_tag() {
    return (
      this.iconString.slice(this.curCursor - 1, this.curCursor + 1) == '/>'
    );
  }
}
