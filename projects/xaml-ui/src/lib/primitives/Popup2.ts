import { AfterViewInit, ApplicationRef, Component, ComponentFactoryResolver, ElementRef, EmbeddedViewRef, Injector, OnInit, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { BasePortalOutlet, DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { FlexibleConnectedPositionStrategy, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';

@Component({
  selector: 'Popup2',
  template: `<div #target><ng-template #content><ng-content/></ng-template></div>`,
  styleUrl: 'Popup2.scss'
})
export class Popup2 implements AfterViewInit {

  @ViewChild('content') testTemplate!: TemplateRef<any>;
  @ViewChild('target') target!: ElementRef;


  private portalHost?: BasePortalOutlet;
  private overlayRef?: OverlayRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay
    ) {
      
    }
  ngAfterViewInit(): void {
    
    const templatePortal = new TemplatePortal(
      this.testTemplate, 
      this.viewContainerRef
    );
    
    let positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.target)
      .withPositions([{ originX: "center", originY: "bottom", overlayX: "center", overlayY: "top" }])
      .withGrowAfterOpen(true)
      .withFlexibleDimensions(true)
      .withPush(true);
    let config = new OverlayConfig({
      positionStrategy: positionStrategy,
      hasBackdrop: true,      
    });
    this.overlayRef = this.overlay.create(config);
    // Attach portal to host
    //this.portalHost = new DomPortalOutlet(document.body, this.componentFactoryResolver, this.appRef, this.injector, document);
    //this.portalHost.attach(templatePortal);
    this.overlayRef.attach(templatePortal);
    this.overlayRef.backdropClick().subscribe(() => this.overlayRef?.detach());
  }
}