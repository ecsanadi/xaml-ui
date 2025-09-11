import { Component, HostBinding, Input } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";

@Component({
  selector: 'Border',
  template: `<ng-content/>`,
  styles: `:host { 
    display: grid;
    position: relative;
  }`
})
export abstract class PanelComponent extends FrameworkElementComponent {
  @Input() @HostBinding('style.background') Background?: string;
  @Input() @HostBinding('style.border-radius') CornerRadius?: string;
  @Input() @HostBinding('style.border-width') BorderThickness?: string;
  @Input() @HostBinding('style.border-color') BorderBrush?: string;

  private _opacity?: number;

  @Input()
  set Opacity(value: number | string | undefined) {
    if (value === null || value === undefined || value === '') {
      this._opacity = undefined; 
      return;
    }
    const numericOpacity = typeof value === 'string' ? Number(value) : value;
    if (Number.isNaN(numericOpacity)) {
      return;
    }
    this._opacity = Math.max(0, Math.min(1, numericOpacity));
  }

  @HostBinding('style.opacity')
  get opacityStyle(): string | undefined {
    return this._opacity !== undefined ? String(this._opacity) : undefined;
  }
  
  @HostBinding('style.border-style')
  private get borderStyle() {
    return this.BorderThickness !== undefined ? 'solid' : undefined;
  }
}