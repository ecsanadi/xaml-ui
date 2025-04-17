import { Component } from "@angular/core";
import { PanelComponent } from "./Panel";

@Component({
  selector: 'Border',
  template: `<ng-content/>`,
  styles: `:host { 
    display: grid;
  }`
})
export class BorderComponent extends PanelComponent {
}