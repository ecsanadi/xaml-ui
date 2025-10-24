import { Component } from "@angular/core";
import { PanelComponent } from "./Panel";

@Component({
  selector: 'Border',
  template: `<ng-content/>`,
  styles: `:host { 
    display: grid;
    position: relative;
    grid-template-areas: "children";

    &::ng-deep > * {
      grid-area: children;
    }
  }`
})
export class BorderComponent extends PanelComponent {
}