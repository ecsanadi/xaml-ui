import { CommonModule } from "@angular/common";
import { Component, HostBinding, Input } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";

@Component({
  selector: 'Border',
  imports: [CommonModule],
  template: `<ng-content/>`,
  styles: `:host { 
    display: grid;
  }`
})
export class BorderComponent extends FrameworkElementComponent {
  @Input() @HostBinding('style.background') Background?: string;
  @Input() @HostBinding('style.border-radius') CornerRadius?: string;
  @Input() @HostBinding('style.border-width') BorderThickness?: string;
  @Input() @HostBinding('style.border-color') BorderBrush?: string;
  
  @HostBinding('style.border-style')
  private get borderStyle() {
    return this.BorderThickness !== undefined ? 'solid' : undefined;
  }
}