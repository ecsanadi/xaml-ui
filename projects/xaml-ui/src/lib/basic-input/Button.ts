import { Component, ContentChild, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";
import { BorderComponent } from "../layout/Border";
import { PopupComponent } from "../primitives/Popup";
import { HorizontalAlignment, toAlignment, toJustification, VerticalAlignment } from "../Common";

@Component({
  selector: 'Button',
  template: `<ng-content/>`,
  styleUrl: 'Button.scss'
})
export class ButtonComponent extends BorderComponent {
  @Input() IsEnabled: boolean = true;

  @Output() Click = new EventEmitter();

  @Input() HorizontalContentAlignment: HorizontalAlignment = 'Center';
  @Input() VerticalContentAlignment: VerticalAlignment = 'Center';

  @HostBinding('style.align-content')
  private get alignContent() {
    return toAlignment(this.VerticalContentAlignment);
  }

  @HostBinding('style.justify-content')
  private get justifyContent() {
    return toJustification(this.HorizontalContentAlignment);
  }

  @HostBinding('attr.type')
  private readonly type = 'button';

  @HostBinding('attr.disabled')
  @HostBinding('class.disabled')
  private get disabled() {
    return this.IsEnabled ? undefined : true;
  }

  @HostBinding('class.popup-open')
  private get flyoutOpen() {
    return this._popup?.IsOpen;
  }

  @ContentChild('ButtonFlyout')
  private _popup?: PopupComponent;

  @HostListener('click', ['$event'])
  private onHostPointerEvent(event: Event) {
    if (!this.IsEnabled) return;

    this.Click.emit();
    this._popup?.Show();
  }
}