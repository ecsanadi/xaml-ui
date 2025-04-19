import { Component, ContentChild, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";
import { BorderComponent } from "../layout/Border";
import { PopupComponent } from "../primitives/Popup";

@Component({
  selector: 'Button',
  template: `<ng-content/>`,
  styleUrl: 'Button.scss'
})
export class ButtonComponent extends BorderComponent {
  @Input() IsEnabled: boolean = true;

  @Output() Click = new EventEmitter();

  @HostBinding('attr.type')
  private readonly type = 'button';

  @HostBinding('attr.disabled')
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
    this.Click.emit();
    this._popup?.Show();    
  }
}