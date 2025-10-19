import { Component, HostBinding, Input } from '@angular/core';
import { FrameworkElementComponent } from '../FrameworkElement';

@Component({
  selector: 'Ellipse',
  template: '',
  styleUrl: 'Ellipse.scss',
})
export class EllipseComponent extends FrameworkElementComponent {
  @Input() @HostBinding('style.background') Fill?: string;
  @Input() @HostBinding('style.border-color') Stroke?: string;
  @Input() @HostBinding('style.border-width') StrokeThickness?: string;
}