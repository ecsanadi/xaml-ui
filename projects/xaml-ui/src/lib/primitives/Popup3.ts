import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, Input, Output, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { FlyoutPresenter, FlyoutPresenterAnimation } from "./FlyoutPresenter";

export const PopupTemplate = `<ng-template #content><FlyoutPresenter [IsVisible]="isVisible" [TransitionAnimation]="transitionAnimation"><ng-content/></FlyoutPresenter></ng-template>`;

@Component({
  imports: [FlyoutPresenter],
  selector: 'Popup3',
  template: PopupTemplate,
  providers: [{ provide: 'xaml-flyout', useExisting: Popup3Component }]
})
export class Popup3Component implements AfterViewInit {
  private _isOpen = false;
  @Input() get IsOpen() {
    return this._isOpen;
  }
  set IsOpen(value: boolean) {
    if (value === this._isOpen) return;
    this._isOpen = value;

    if (value) {
      this._overlayRef?.attach(this._templatePortal);
      setTimeout(() => this.isVisible = true, 0);
    }
    else {
      this.isVisible = false;
      setTimeout(() => this._overlayRef?.detach(), FlyoutPresenter.TransitionDuration);
    }
    this.IsOpenChange.emit(value);
  }

  protected isVisible = false;

  @Output() IsOpenChange = new EventEmitter<boolean>();
  @ViewChild('content') _template!: TemplateRef<any>;

  @HostBinding('style')
  private get style() {
    return {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  }

  protected get transitionAnimation(): FlyoutPresenterAnimation {
    return 'Default';
  }

  protected get positioning(): ConnectedPosition {
    return {
      originX: 'center', originY: 'bottom',
      overlayX: 'center', overlayY: 'top'
    };
  };

  private _overlayRef?: OverlayRef;
  private _templatePortal?: TemplatePortal;

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

    let positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(this._hostElement)
      .withPositions([this.positioning])
      .withGrowAfterOpen(true)
      .withFlexibleDimensions(true)
      .withPush(true);

    let config = new OverlayConfig({
      positionStrategy: positionStrategy,
      hasBackdrop: true,
    });
    this._overlayRef = this._overlay.create(config);
    this._overlayRef.backdropClick().subscribe(() => this.Hide());
  }

  Show() {
    this.IsOpen = true;
  }

  Hide() {
    this.IsOpen = false;
  }
}