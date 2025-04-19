import { Component, Host, HostBinding, Input } from "@angular/core";
import { HorizontalAlignment, VerticalAlignment } from "./Common";

@Component({
  selector: 'FrameworkElement',
  template: `<ng-container/>`
})
export abstract class FrameworkElementComponent {
  @Input() Width?: string;
  @Input() Height?: string;
  @Input() HorizontalAlignment: HorizontalAlignment = 'Stretch';
  @Input() VerticalAlignment: VerticalAlignment = 'Stretch';
  @Input() @HostBinding('style.margin') Margin?: string;
  @Input() @HostBinding('style.padding') Padding?: string;

  @HostBinding('style.width')
  private get width() {
    if (this.Width !== undefined) return this.Width;
    return this.HorizontalAlignment === 'Stretch' ? undefined : 'min-content';
  }

  @HostBinding('style.height')
  private get height() {
    if (this.Height !== undefined) return this.Height;
    return this.VerticalAlignment === 'Stretch' ? undefined : 'min-content';
  }

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

  private static _nextId = 1;
  protected readonly _id = FrameworkElementComponent._nextId++;
}