import { Component, Input, HostBinding } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'ProgressRing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg class="progress-ring-svg" [attr.viewBox]="'0 0 ' + _size + ' ' + _size" [style.width]="Width" [style.height]="Height">
      <circle class="progress-ring-indicator" 
        [attr.cx]="_size/2" 
        [attr.cy]="_size/2" 
        [attr.r]="_radius" 
        fill="none" 
        [attr.stroke-width]="_strokeWidth"
        [attr.stroke-dasharray]="_circumference"
        [attr.stroke-dashoffset]="IsIndeterminate ? null : dashOffset"
      />
    </svg>
  `,
  styleUrls: ['ProgressRing.scss']
})
export class ProgressRingComponent extends FrameworkElementComponent {
  @Input() Minimum: number = 0;
  @Input() Maximum: number = 1;
  @Input() Value: number = 0;
  @Input() IsIndeterminate: boolean = false;

  @HostBinding('class.indeterminate')
  get indeterminateClass() {
    return this.IsIndeterminate;
  }

  protected readonly _size = 40;
  protected readonly _radius = 16;
  protected readonly _strokeWidth = 4;
  protected readonly _circumference = 2 * Math.PI * this._radius;

  constructor() {
    super();
    this.Width = this._size + 'px';
    this.Height = this._size + 'px';
  }

  get dashOffset() {
    let progress = (this.Value - this.Minimum) / (this.Maximum - this.Minimum);
    return this._circumference * (1 - progress);
  }
} 