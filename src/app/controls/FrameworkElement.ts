import { Component, HostBinding, Input } from "@angular/core";

export type HorizontalAlignment = 'Left' | 'Center' | 'Right' | 'Stretch';
export type VerticalAlignment = 'Top' | 'Center' | 'Bottom' | 'Stretch';

@Component({
  selector: 'FrameworkElement',
  template: `<ng-container/>`
})
export class FrameworkElement {
  @Input() @HostBinding('style.width') Width?: string;
  @Input() @HostBinding('style.height') Height?: string;
  @Input() HorizontalAlignment: HorizontalAlignment = 'Stretch';
  @Input() VerticalAlignment: VerticalAlignment = 'Stretch';
  @Input() @HostBinding('style.margin') Margin?: string;
  @Input() @HostBinding('style.padding') Padding?: string;

  @HostBinding('style.justify-self')
  get justifySelf() {
    return this.HorizontalAlignment.toLowerCase();
  }

  @HostBinding('style.align-self')
  get alignSelf() {
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
}