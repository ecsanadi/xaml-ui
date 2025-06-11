import { Component, ElementRef, Injector } from "@angular/core";

@Component({
  selector: 'ItemContainer',
  template: `<ng-content/>`,
  styles: `:host {
    display: grid;
    position: relative;
  }`
})
export class ItemContainerComponent {
  constructor(
    public Element : ElementRef,
    public Injector: Injector
  ) {

  }
}