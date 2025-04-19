import { CommonModule } from "@angular/common";
import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from "@angular/core";
import { MenuFlyoutItemBase } from "./MenuFlyoutItemBase";

@Component({
  selector: 'MenuFlyoutItem',
  imports: [CommonModule],
  template: `<div class="icon">{{Icon}}</div>
  <div class="text">{{Text}}</div>
  <div class="submenu-indicator"></div>`,
  styleUrl: 'MenuFlyoutItem.scss'
})
export class MenuFlyoutItemComponent extends MenuFlyoutItemBase {
  @Input() Text = '';
  @Input() Icon?: string;
  @Input() Tag: any;
  @Output() Click = new EventEmitter<any>();

  @HostListener('click', [])
  onClick() {
    this.Click.emit(this.Tag);
  }
}