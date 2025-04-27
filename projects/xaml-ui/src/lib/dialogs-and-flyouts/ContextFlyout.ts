import { AfterViewInit, Directive, ElementRef, HostBinding, ViewContainerRef } from "@angular/core";
import { FlyoutComponent } from "./Flyout";
import { MenuFlyoutComponent } from "../menus-and-toolbars/MenuFlyout";
import { Flyout2Component } from "./Flyout2";

@Directive({
  selector: '[ContextFlyout]'
})
export class ContextFlyoutDirective implements AfterViewInit {

  private _flyout?: Flyout2Component;

  constructor(
    private _hostComponent: ElementRef,
    private _viewContainer: ViewContainerRef
  ) {
 
  }

  ngAfterViewInit(): void {
    this._flyout = this._viewContainer.injector.get(Flyout2Component, null) ||
      this._viewContainer.injector.get(MenuFlyoutComponent, null) as Flyout2Component;

    if (this._flyout) {
      this._flyout.Placement = 'BottomEdgeAlignedLeft';
    }

    let parentElement = (this._hostComponent.nativeElement as HTMLElement).parentElement;
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