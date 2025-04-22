import { Component } from "@angular/core";
import { FlyoutComponent } from "../dialogs-and-flyouts/Flyout";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'MenuFlyout',
  imports: [CommonModule],
  template: `<div class="popup-backdrop" (click)="onBackdropClick($event)" *ngIf="IsOpen"></div>
    <div class="popup-container" [ngStyle]="containerStyle" [ngClass]="containerClass">
    <div class="popup-content" [ngStyle]="contentStyle" *ngIf="isRendered">
      <div class="menu-container" (click)="onMenuClick($event)">
        <ng-content/>
      </div>
    </div>
  </div>`,
  styleUrls: ['../primitives/Popup.scss', 'MenuFlyout.scss']
})
export class MenuFlyoutComponent extends FlyoutComponent {
  protected onMenuClick(event: Event) {
    this.IsOpen = false;
    event.stopPropagation();
  }
}