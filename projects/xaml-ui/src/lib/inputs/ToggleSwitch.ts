import { Component } from "@angular/core";
import { CheckBox } from "./CheckBox";

@Component({
  selector: 'ToggleSwitch',
  template: `<label class="container">
    <input type="checkbox" [checked]="IsChecked" (change)="onIsCheckedChange($event)" [disabled]="!IsEnabled">
    <div class="slider">
      <div class="thumb"></div>
    </div>
    <div class="content"><ng-content/></div>
  </label>`,
  styleUrl: 'ToggleSwitch.scss'
})
export class ToggleSwitch extends CheckBox {
  
}