import { Component } from "@angular/core";
import { PanelComponent } from "./Panel";

@Component({
  selector: 'Border',
  template: `<ng-content/>`,
  styles: `:host { 
    display: grid;
    position: relative;
  }`
})
export class BorderComponent extends PanelComponent {
}