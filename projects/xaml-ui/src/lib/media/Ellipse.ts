import { Component, HostBinding, Input } from '@angular/core';
import { FrameworkElementComponent } from '../FrameworkElement';

@Component({
  selector: 'Ellipse',
  template: '',
  styleUrl: 'Ellipse.scss',
})
export class EllipseComponent extends FrameworkElementComponent {
  @Input() @HostBinding('style.background') Fill?: string;
  @Input() @HostBinding('style.borderColor') Stroke?: string;
  @Input() @HostBinding('style.borderWidth.px') StrokeThickness: number = 0;
  // @Input() @HostBinding('style.width.px') Width?: number;
  // @Input() @HostBinding('style.height.px') Height?: number;
  @HostBinding('style.borderStyle') borderStyle = 'solid';
  @HostBinding('style.borderRadius') borderRadius = '50%';
}