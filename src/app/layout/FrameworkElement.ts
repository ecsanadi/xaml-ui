import { Component, Host, HostBinding, Input } from "@angular/core";
import { HorizontalAlignment, VerticalAlignment } from "./Common";

@Component({
  selector: 'FrameworkElement',
  template: `<ng-container/>`
})
export abstract class FrameworkElement {
  @Input() @HostBinding('style.width') Width?: string;
  @Input() @HostBinding('style.height') Height?: string;
  @Input() HorizontalAlignment: HorizontalAlignment = 'Stretch';
  @Input() VerticalAlignment: VerticalAlignment = 'Stretch';
  @Input() @HostBinding('style.margin') Margin?: string;
  @Input() @HostBinding('style.padding') Padding?: string;
  
  @HostBinding('style.justify-self')
  private get justifySelf() {
    return this.HorizontalAlignment.toLowerCase();
  }

  @HostBinding('style.align-self')
  private get alignSelf() {
    switch (this.VerticalAlignment) {
      case 'Top':
        return 'flex-start';
      case 'Center':
        return 'center';
      case 'Bottom':
        return 'flex-end';
      case 'Stretch':
        return 'stretch';
    }
  }

  @HostBinding('style.overflow')
  protected get overflow() {
    return 'clip';
  }
}