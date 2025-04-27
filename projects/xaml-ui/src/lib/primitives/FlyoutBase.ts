import { ConnectedPosition, FlexibleConnectedPositionStrategyOrigin, Overlay, OverlayConfig, OverlayRef } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, Input, Output, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { FlyoutPresenter, FlyoutPresenterAnimation } from "./FlyoutPresenter";
import { FlyoutPlacementMode } from "../Common";

export const PopupTemplate = `<ng-template #template><FlyoutPresenter #presenter [IsVisible]="isVisible" [TransitionAnimation]="transitionAnimation"><ng-content/></FlyoutPresenter></ng-template>`;

@Component({
  imports: [FlyoutPresenter],
  selector: 'FlyoutBase',
  template: PopupTemplate,
  providers: [{ provide: 'xaml-flyout', useExisting: FlyoutBaseComponent }]
})
export abstract class FlyoutBaseComponent implements AfterViewInit {

  @Input() Placement: FlyoutPlacementMode = 'Top';

  private _isOpen = false;
  @Input() get IsOpen() {
    return this._isOpen;
  }
  set IsOpen(value: boolean) {
    if (value === this._isOpen) return;
    this._isOpen = value;

    if (value) {
      let position = this.positioning;
      position.offsetX = this.HorizontalOffset;
      position.offsetY = this.VerticalOffset;

      let positionStrategy = this._overlay
        .position()
        .flexibleConnectedTo(this.Target ?? this._hostElement)
        .withPositions([position])
        .withGrowAfterOpen(true)
        .withFlexibleDimensions(true)
        .withPush(true);

      this._overlayRef.updatePositionStrategy(positionStrategy);
      this._overlayRef.attach(this._templatePortal);

      this._overlayRef.backdropElement?.addEventListener('contextmenu', p => { p.preventDefault(); this.Hide(); });
      setTimeout(() => this.isVisible = true, 0);
    }
    else {
      this.isVisible = false;
      setTimeout(() => this._overlayRef.detach(), FlyoutPresenter.TransitionDuration);
    }
    this.IsOpenChange.emit(value);
  }

  protected isVisible = false;

  @Output() IsOpenChange = new EventEmitter<boolean>();

  @Input() Target: FlexibleConnectedPositionStrategyOrigin | null = null;

  @ViewChild('template') private _template!: TemplateRef<any>;

  @HostBinding('style')
  private get style() {
    return {
      position: 'absolute',
      inset: 0
    }
  }

  protected get transitionAnimation(): FlyoutPresenterAnimation {
    return 'Default';
  }

  @Input() VerticalOffset = 0;
  @Input() HorizontalOffset = 0;

  private get positioning(): ConnectedPosition {

    switch (this.Placement) {
      case "Top":
        return {
          originX: 'center', originY: 'top',
          overlayX: 'center', overlayY: 'bottom'
        };
      case "TopEdgeAlignedLeft":
        return {
          originX: 'start', originY: 'top',
          overlayX: 'start', overlayY: 'bottom'
        };
      case "TopEdgeAlignedRight":
        return {
          originX: 'end', originY: 'top',
          overlayX: 'end', overlayY: 'bottom'
        };

      case "Bottom":
        return {
          originX: 'center', originY: 'bottom',
          overlayX: 'center', overlayY: 'top'
        };
      case "BottomEdgeAlignedLeft":
        return {
          originX: 'start', originY: 'bottom',
          overlayX: 'start', overlayY: 'top'
        };
      case "BottomEdgeAlignedRight":
        return {
          originX: 'end', originY: 'bottom',
          overlayX: 'end', overlayY: 'top'
        };

      case "Left":
        return {
          originX: 'start', originY: 'center',
          overlayX: 'end', overlayY: 'center'
        };
      case "LeftEdgeAlignedTop":
        return {
          originX: 'start', originY: 'top',
          overlayX: 'end', overlayY: 'top'
        };
      case "LeftEdgeAlignedBottom":
        return {
          originX: 'start', originY: 'bottom',
          overlayX: 'end', overlayY: 'bottom'
        };

      case "Right":
        return {
          originX: 'end', originY: 'center',
          overlayX: 'start', overlayY: 'center'
        };
      case "RightEdgeAlignedTop":
        return {
          originX: 'end', originY: 'top',
          overlayX: 'start', overlayY: 'top'
        };
      case "RightEdgeAlignedBottom":
        return {
          originX: 'end', originY: 'bottom',
          overlayX: 'start', overlayY: 'bottom'
        };
    }
  };

  private _overlayRef!: OverlayRef;
  private _templatePortal!: TemplatePortal;

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _overlay: Overlay,
    private _hostElement: ElementRef
  ) {

  }

  ngAfterViewInit(): void {
    this._templatePortal = new TemplatePortal(
      this._template,
      this._viewContainerRef
    );

    let config = new OverlayConfig({
      hasBackdrop: true,
    });
    this._overlayRef = this._overlay.create(config);
    this._overlayRef.backdropClick().subscribe(() => this.Hide());
    this.OnOverlay(this._overlayRef);
  }

  protected OnOverlay(overlay: OverlayRef) {

  }

  Show() {
    this.IsOpen = true;
  }

  Hide() {
    this.IsOpen = false;
  }
}