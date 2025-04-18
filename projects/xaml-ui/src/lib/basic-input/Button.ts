import { Component, ContentChild, HostBinding, HostListener, Input } from "@angular/core";
import { BorderComponent } from "../layout/Border";
import { Flyout } from "../dialogs-and-flyouts/Flyout";

@Component({
  selector: 'Button',
  template: `<ng-content/><ng-content select="flyout"/>`,
  styleUrl: 'Button.scss'
})
export class ButtonComponent extends BorderComponent {
  @Input() IsEnabled: boolean = true;

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
    this._flyout?.Show();
  }
}