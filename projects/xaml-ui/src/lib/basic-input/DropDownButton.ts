import { Component } from "@angular/core";
import { ButtonComponent } from "./Button";

@Component({
  selector: 'DropDownButton',
  template: `<div class="drop-down-glyph">&#xE70D;</div><ng-content/>`,
  styleUrls: ['Button.scss', 'DropDownButton.scss']
})
export class DropDownButtonComponent extends ButtonComponent {
  
}