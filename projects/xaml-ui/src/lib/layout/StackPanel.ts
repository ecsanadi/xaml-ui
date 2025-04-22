import { Component, HostBinding, Input } from "@angular/core";
import { Orientation } from "../Common";
import { PanelComponent } from "./Panel";

@Component({
  selector: 'StackPanel',
  template: `<ng-content/>`,
  styles: `:host { 
    display: grid;
    position: relative;
  }`
})
export class StackPanelComponent extends PanelComponent {
  @Input() Orientation: Orientation = 'Vertical';
  @Input() @HostBinding('style.gap') Spacing : number | string | undefined;

  @HostBinding('style.grid-auto-flow') 
  private get gridAutoColumns() {
    return this.Orientation === 'Horizontal' ? 'column' : 'row';
  }
}