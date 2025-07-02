import { CommonModule } from "@angular/common";
import { Component, EventEmitter, HostBinding, HostListener, Input, Output, ViewChild } from "@angular/core";
import { MenuFlyoutItemBase } from "./MenuFlyoutItemBase";

@Component({
  selector: 'ToggleMenuFlyoutItem',
  imports: [CommonModule],
  template: `<div class="icon">{{IsChecked ? '\uE73E' : '' }}</div>
  <div class="text">{{Text}}</div>
  <div class="submenu-indicator"></div>`,
  styleUrl: 'MenuFlyoutItem.scss'
})
export class ToggleMenuFlyoutItemComponent extends MenuFlyoutItemBase {
  @Input() IsEnabled = true;
  @Input() Text = '';
  @Input() @HostBinding('class.checked') IsChecked: boolean = false;
  @Output() IsCheckedChange = new EventEmitter<boolean>();

  @HostBinding('class.disabled')
  private get disabled() {
    return !this.IsEnabled;
  }

  @HostListener('pointerup', ['$event'])
  private onPointerUp(event: PointerEvent) {
    if (!this.IsEnabled) return;
    this.IsChecked = !this.IsChecked;
    this.IsCheckedChange.emit(this.IsChecked);
  }
}