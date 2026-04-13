import { Component, HostBinding, Input } from "@angular/core";
import { Orientation } from "../Common";
import { FrameworkElementComponent } from "../FrameworkElement";

@Component({
  selector: 'Separator',
  template: '',
  styles: `:host {
    display: grid;
    position: relative;
    border-radius: min(50cqw, 50cqh);
    background: var(--DividerStrokeColorDefault);
  }`
})
export class SeparatorComponent extends FrameworkElementComponent {
  constructor() {
    super();
    this.MinWidth = '2px';
    this.MinHeight = '2px';
  }
}
