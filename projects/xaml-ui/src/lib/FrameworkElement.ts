import { Component, HostBinding, Input } from "@angular/core";
import { HorizontalAlignment, toAlignment, toJustification, VerticalAlignment } from "./Common";

@Component({
  selector: 'FrameworkElement',
  template: `<ng-container/>`
})
export abstract class FrameworkElementComponent {
  @Input() Width?: string;
  @Input() MinWidth?: string;
  @Input() @HostBinding('style.max-width') MaxWidth?: string;

  @Input() Height?: string;
  @Input() MinHeight?: string;
  @Input() @HostBinding('style.max-height') MaxHeight?: string;

  @Input() HorizontalAlignment: HorizontalAlignment = 'Stretch';
  @Input() VerticalAlignment: VerticalAlignment = 'Stretch';
  @Input() @HostBinding('style.margin') Margin?: string;
  @Input() @HostBinding('style.padding') Padding?: string;

  @HostBinding('style.overflow')
  private get overflow() {
    return 'hidden';
  }

  @HostBinding('style.min-width')
  private get minWidth() {
    if (this.MinWidth !== undefined) return this.MinWidth;
    return this.MaxWidth === undefined && this.HorizontalAlignment === 'Stretch' ? 'min-content' : undefined;
  }

  @HostBinding('style.min-height')
  private get minHeight() {
    if (this.MinHeight !== undefined) return this.MinHeight;
    return this.MaxHeight === undefined && this.VerticalAlignment === 'Stretch' ? 'min-content' : undefined;
  }

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
    return toJustification(this.HorizontalAlignment);
  }

  @HostBinding('style.align-self')
  private get alignSelf() {
    return toAlignment(this.VerticalAlignment);
  }

  private static _nextId = 1;
  protected readonly _id = FrameworkElementComponent._nextId++;
}