import { Component, EventEmitter, HostBinding, Input, Output } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";

@Component({
  selector: 'AppBarButton',
  template: `<div class="icon">{{Icon}}</div><div class="text">{{Text}}</div>`,
  styleUrl: 'AppBarButton.scss'
})
export class AppBarButtonComponent extends FrameworkElementComponent {
  @Input() IsEnabled = true;
  @Input() Text?: string;
  @Input() Icon?: string;
  @Output() Click = new EventEmitter();

  @HostBinding('class.disabled')
  private get disabled() {
    return !this.IsEnabled;
  }
}