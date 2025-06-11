import { AfterViewInit, Directive, ElementRef, HostBinding, ViewContainerRef } from "@angular/core";
import { FlyoutComponent } from "./Flyout";
import { MenuFlyoutComponent } from "../menus-and-toolbars/MenuFlyout";
import { ItemContainerComponent } from "../primitives/ItemContainer";

@Directive()
export abstract class FlyoutDirective implements AfterViewInit {

  private _flyout?: FlyoutComponent;

  constructor(
    private _viewContainer: ViewContainerRef
  ) { }

  protected abstract get HostElement(): HTMLElement | null;

  ngAfterViewInit(): void {
    for (let type of [FlyoutComponent, MenuFlyoutComponent]) {
      this._flyout = this._viewContainer.injector.get(type, null, { self: true }) as FlyoutComponent;
      if (this._flyout) break;
    }

    if (this._flyout) {
      this._flyout.Placement = 'BottomEdgeAlignedLeft';
    }

    let hostElement = this.HostElement;
    if (hostElement) {
      hostElement.oncontextmenu = p => this.onContextMenu(p);
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

@Directive({
  selector: '[ContextFlyout]'
})
export class ContextFlyoutDirective extends FlyoutDirective {
  constructor(
    private _hostComponent: ElementRef,
    viewContainer: ViewContainerRef
  ) {
    super(viewContainer);
  }

  protected override get HostElement() {
    return (this._hostComponent.nativeElement as HTMLElement).parentElement;
  }
}

@Directive({
  selector: '[ItemFlyout]'
})
export class ItemFlyoutDirective extends FlyoutDirective {

  constructor(
    private _hostComponent: ItemContainerComponent,
    viewContainer: ViewContainerRef
  ) {
    super(viewContainer);
  }

  protected override get HostElement() {
    return this._hostComponent.Element.nativeElement as HTMLElement;
  }
}