import { Component, HostListener, Input } from "@angular/core";
import { ButtonComponent } from "./Button";

@Component({
  selector: 'RepeatButton',
  template: `<ng-content/>`,
  styleUrl: 'Button.scss'
})
export class RepeatButtonComponent extends ButtonComponent {
  @Input() Delay: number = 250;
  @Input() Interval: number = 250;

  private _delayTimer: any;
  private _intervalTimer: any;

  @HostListener('pointerdown')
  private onPointerDown() {
    if (!this.IsEnabled) return;

    this._delayTimer = setTimeout(() => {
      this.Click.emit();

      this._intervalTimer = setInterval(() => {
        this.Click.emit();
      }, this.Interval);
    }, this.Delay);
  }

  @HostListener('pointerup')
  private onPointerUp() {
    if (this._delayTimer !== undefined) clearTimeout(this._delayTimer);
    if (this._intervalTimer !== undefined) clearInterval(this._intervalTimer);
  }

  protected override onHostPointerEvent(event: Event) {
    //Disable pointer event handling on the base button
  }
}