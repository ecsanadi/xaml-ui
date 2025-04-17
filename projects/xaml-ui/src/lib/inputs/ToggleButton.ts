import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";
import { Button } from "./Button";

@Component({
  selector: 'ToggleButton',
  template: `<ng-content/>`,
  styleUrl: 'Button.scss'
})
export class ToggleButton extends Button {
  @Input() @HostBinding('class.checked') IsChecked: boolean = false;
  @Output() IsCheckedChange = new EventEmitter<boolean>();

  @HostListener('pointerup', ['$event'])
  onPointerUp(event: PointerEvent) {
    this.IsChecked = !this.IsChecked;
    this.IsCheckedChange.emit(this.IsChecked);
  }
}