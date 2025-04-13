import { Component } from "@angular/core";
import { Border } from "../layout/Border";

@Component({
  selector: 'Button',
  template: `<ng-container><ng-content/></ng-container>`,
  styleUrl: 'Button.scss'
})
export class Button extends Border {
}