import { CommonModule } from "@angular/common";
import { FrameworkElementComponent } from "./FrameworkElement";
import { Component, HostBinding, Input } from "@angular/core";
import { ScrollMode } from "./Common";

@Component({
  selector: 'ScrollViewer',
  template: `<ng-content/>`,
  styles: `:host {
    display: grid;
  }`
})
export class ScrollViewerComponent extends FrameworkElementComponent {
  @Input() HorizontalScrollMode: ScrollMode = 'Enabled';
  @Input() VerticalScrollMode: ScrollMode = 'Enabled';

  private static toOverflow(value: ScrollMode) {
    switch (value) {
      case 'Disabled':
        return 'hidden';
      case 'Enabled':
        return 'scroll';
      case 'Auto':
        return 'auto';
    }
  }

  @HostBinding('style.overflow-x')
  private get overflowX() {
    return ScrollViewerComponent.toOverflow(this.HorizontalScrollMode);
  }

  @HostBinding('style.overflow-y')
  private get overflowY() {
    return ScrollViewerComponent.toOverflow(this.VerticalScrollMode);
  }
}