import { Component, HostBinding, Input } from "@angular/core";
import { Orientation } from "../Common";
import { PanelComponent } from "./Panel";

@Component({
  selector: 'StackPanel',
  template: `<ng-content/>`,
  styles: `:host { 
    display: flex;
    position: relative;
  }`
})
export class StackPanelComponent extends PanelComponent {
  @Input() Orientation: Orientation = 'Vertical';
  @Input() @HostBinding('style.gap') Spacing : number | string = 0;

  @HostBinding('style.flex-direction') 
  private get flexDirection() {
    return this.Orientation === 'Horizontal' ? 'row' : 'column';
  }
}