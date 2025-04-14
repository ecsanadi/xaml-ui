import { Component, EventEmitter, HostBinding, Input, Output } from "@angular/core";
import { FrameworkElement } from "../layout/FrameworkElement";
import { Orientation } from "../layout/Common";

@Component({
  selector: 'Slider',
  template: `<input type="range" 
    [min]="Minimum" 
    [max]="Maximum" 
    [value]="Value" 
    [step]="StepFrequency" 
    (change)="onValueChange($event)" 
    [disabled]="!IsEnabled"
    [className]="Orientation.toLowerCase()">`,
  styleUrl: 'Slider.scss'
})
export class Slider extends FrameworkElement {
  @Input() Minimum: number = 0.0;
  @Input() Maximum: number = 1.0;
  @Input() StepFrequency: number = 0.01;
  @Input() Value: number = 0.0;
  @Output() ValueChange = new EventEmitter<number>();
  @Input() IsEnabled = true;
  @Input() Orientation: Orientation = 'Horizontal';

  onValueChange(event: Event) {
    this.Value = parseFloat((event.target as HTMLInputElement).value);
    this.ValueChange.emit(this.Value);
  }
}