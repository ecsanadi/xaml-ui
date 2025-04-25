import { Component, ContentChild, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { PopupComponent } from "../primitives/Popup";

@Component({
  selector: 'AppBarButton',
  template: `<div class="icon">{{Icon}}</div><div class="text">{{Text}}</div><ng-content/>`,
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

  @ContentChild('xaml-flyout')
  private _flyout?: PopupComponent;

  @HostListener('click', ['$event'])
  protected onHostPointerEvent(event: Event) {
    if (!this.IsEnabled) return;

    this.Click.emit(event);
    this._flyout?.Show();
  }
}