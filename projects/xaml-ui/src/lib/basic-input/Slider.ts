import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { Orientation } from "../Common";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'Slider',
  template: `<input type="range" 
    [step]="StepFrequency" 
    [min]="Minimum" 
    [max]="Maximum" 
    [value]="Value" 
    (input)="onInput($event)" 
    [disabled]="!IsEnabled"
    [className]="Orientation.toLowerCase()"
    [ngStyle]="inputStyle">`,
  imports: [CommonModule],
  styleUrl: 'Slider.scss'
})
export class SliderComponent extends FrameworkElementComponent {
  @Input() Minimum: number = 0.0;
  @Input() Maximum: number = 1.0;
  @Input() StepFrequency: number = 0.01;
  @Input() Value: number = 0.0;
  @Output() ValueChange = new EventEmitter<number>();
  @Input() IsEnabled = true;
  @Input() Orientation: Orientation = 'Horizontal';

  protected onInput(event: Event) {
    this.Value = parseFloat((event.target as HTMLInputElement).value);
    this.ValueChange.emit(this.Value);
  }

  protected get inputStyle() {
    let style: { [key: string]: string } = {};
    if (this.Orientation === 'Horizontal' && this.Width !== undefined) {
      style['width'] = this.Width;
    }

    if (this.Orientation === 'Vertical' && this.Height !== undefined) {
      style['height'] = this.Height;
    }

    const min = Number(this.Minimum) ?? 0;
    const max = Number(this.Maximum) ?? 1;
    const val = Math.min(Math.max(Number(this.Value) ?? min, min), max);
    const pct = (val - min) / Math.max(1e-9, (max - min));
    style['--progress'] = (pct * 100).toFixed(4) + '%';

    return style;
  }
}