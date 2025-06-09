import { Overlay, OverlayConfig } from "@angular/cdk/overlay";
import { Component, EventEmitter, Output, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { resume_after, resume_on_event } from "../Common";
import { TemplatePortal } from "@angular/cdk/portal";

@Component({
  template: ''
})
export abstract class Dialog {
  @Output() Closed = new EventEmitter();

  @ViewChild('template') private _template!: TemplateRef<any>;

  private _overlay!: Overlay;
  private _viewContainerRef!: ViewContainerRef;

  static Create<T extends Dialog>(type: { new(...args: any[]): T }, container: ViewContainerRef): T {
    let component = container.createComponent(type);
    component.instance._overlay = container.injector.get(Overlay);
    component.instance._viewContainerRef = container.injector.get(ViewContainerRef);
    component.instance.Closed.subscribe(() => component.destroy());
    return component.instance;
  }

  async ShowAsync(): Promise<any> {
    //Wait for a layout cycle to ensure templates etc. are ready
    await resume_after(0);

    //Create overlay
    let positionStrategy = this._overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    let config = new OverlayConfig({
      hasBackdrop: true,
      positionStrategy: positionStrategy
    });

    let overlayRef = this._overlay.create(config);

    //Attach template
    let templatePortal = new TemplatePortal(
      this._template,
      this._viewContainerRef
    );

    overlayRef.attach(templatePortal);

    //Wait for close
    await resume_on_event(this.Closed);

    overlayRef.detach();
  }

  Hide() {
    this.Closed.emit();
  }
}