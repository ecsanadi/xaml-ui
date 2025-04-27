import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Flyout2Component } from "../dialogs-and-flyouts/Flyout2";
import { FlyoutPresenter, FlyoutPresenterAnimation } from "../primitives/FlyoutPresenter";
import { PopupTemplate } from "../primitives/FlyoutBase";
import { OverlayRef } from "@angular/cdk/overlay-module.d-CSrPj90C";

@Component({
  selector: 'MenuFlyout',
  imports: [CommonModule, FlyoutPresenter],
  template: PopupTemplate,
  styleUrls: ['../primitives/Popup.scss', 'MenuFlyout.scss'],
  providers: [{ provide: 'xaml-flyout', useExisting: MenuFlyoutComponent }]
})
export class MenuFlyoutComponent extends Flyout2Component implements AfterViewInit {

  protected override get transitionAnimation(): FlyoutPresenterAnimation {
    return 'Default';
  }

  protected override OnOverlay(overlay: OverlayRef): void {
    overlay.overlayElement.addEventListener('click', p => this.onMenuClick(p));
  }

  private onMenuClick(event: Event) {
    this.IsOpen = false;
    event.stopPropagation();
  }
}