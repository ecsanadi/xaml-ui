import { Component, ContentChild, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";
import { BorderComponent } from "../layout/Border";
import { Flyout } from "../dialogs-and-flyouts/Flyout";

@Component({
  selector: 'Button',
  template: `<ng-content/><ng-content select="flyout"/>`,
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

  @HostBinding('class.flyout-open')
  private get flyoutOpen() {
    return this._flyout?.IsOpen;
  }

  @ContentChild(Flyout)
  private _flyout?: Flyout;

  @HostListener('click', ['$event'])
  private onHostPointerEvent(event: Event) {
    this.Click.emit();
    this._flyout?.Show();    
  }
}