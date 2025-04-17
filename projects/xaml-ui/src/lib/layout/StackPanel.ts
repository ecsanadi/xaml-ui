import { Component, HostBinding, Input } from "@angular/core";
import { BorderComponent } from "./Border";
import { Orientation } from "./Common";

@Component({
  selector: 'StackPanel',
  template: `<ng-content/>`,
  styles: `:host { 
    display: flex;
  }`
})
export class StackPanelComponent extends BorderComponent {
  @Input() Orientation: Orientation = 'Vertical';
  @Input() @HostBinding('style.gap') Spacing : number | string = 0;

  @HostBinding('style.flex-direction') private get flexDirection() {
    return this.Orientation === 'Horizontal' ? 'row' : 'column';
  }
}