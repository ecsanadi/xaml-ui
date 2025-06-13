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
  @Input() @HostBinding('style.gap') Spacing? : string;

  @HostBinding('style.grid-auto-flow') 
  private get gridAutoFlow() {
    return this.Orientation === 'Horizontal' ? 'column' : 'row';
  }

  @HostBinding('style.grid-auto-rows') 
  private get gridAutoRows() {
    return this.Orientation === 'Vertical' ? 'min-content' : undefined;
  }

  @HostBinding('style.grid-auto-columns') 
  private get gridAutoColumns() {
    return this.Orientation === 'Horizontal' ? 'min-content' : undefined;
  }
}