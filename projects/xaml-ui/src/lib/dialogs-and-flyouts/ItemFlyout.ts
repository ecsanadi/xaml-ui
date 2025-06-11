import { AfterViewInit, Directive, ElementRef, HostBinding, Optional, ViewContainerRef } from "@angular/core";
import { FlyoutComponent } from "./Flyout";
import { MenuFlyoutComponent } from "../menus-and-toolbars/MenuFlyout";
import { ItemContainerComponent } from "../primitives/ItemContainer";

@Directive({
  selector: '[ItemFlyout]'
})
export class ItemFlyoutDirective implements AfterViewInit {

  private _flyout?: FlyoutComponent;

  constructor(
    private _viewContainer: ViewContainerRef,
    private _hostComponent: ItemContainerComponent
  ) {
  }

  ngAfterViewInit(): void {
    this._flyout = this._viewContainer.injector.get(FlyoutComponent, null) ||
      this._viewContainer.injector.get(MenuFlyoutComponent, null) as FlyoutComponent;

    if (this._flyout) {
      this._flyout.Placement = 'BottomEdgeAlignedLeft';
    }

    let parentElement = this._hostComponent.Element.nativeElement as HTMLElement;
    if (parentElement) {
      parentElement.oncontextmenu = p => this.onContextMenu(p);
    }
  }

  private onContextMenu(event: MouseEvent) {
    if (!this._flyout) return;

    if (!this._flyout.IsOpen) {
      this._flyout.Target = { x: event.clientX, y: event.clientY }
      this._flyout.IsOpen = true;
    }
    else {
      this._flyout.IsOpen = false;
    }

    event.preventDefault();
    event.stopPropagation();
  }
}