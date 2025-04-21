import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";

export type Color = number;
export function toString(value: Color) {
  return '#' + value.toString(16).padStart(8, '0');
}

@Component({
  selector: 'ColorPicker',
  template: `<canvas #canvas (pointerdown)="onPointerDown($event)" (pointermove)="onPointerMove($event)"></canvas><div #selector class="selector"></div>`,
  styleUrl: 'ColorPicker.scss'
})
export class ColorPickerComponent extends FrameworkElementComponent implements AfterViewInit {

  private _color: Color = 0xffffffff;
  @Input() get Color() {
    return this._color;
  }
  set Color(value: Color) {
    if(this._color === value) return;

    this._color = value;
    this.ColorChange.emit(value);
  }
  @Output() ColorChange = new EventEmitter<Color>();

  @ViewChild('canvas')
  private _canvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('selector')
  private _selector!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    let canvas = this._canvas.nativeElement;
    canvas.width = parseInt(this.Width ?? '300');
    canvas.height = parseInt(this.Height ?? '300');

    let context = canvas.getContext('2d')!;
    let radius = canvas.width / 2;

    // Draw hue circle
    for (let angle = 0; angle < 360; angle++) {
      let startAngle = (angle - 1) * (Math.PI / 180);
      let endAngle = (angle + 1) * (Math.PI / 180);
      context.beginPath();
      context.moveTo(radius, radius);
      context.arc(radius, radius, radius * 2, startAngle, endAngle);
      context.closePath();
      context.fillStyle = `hsl(${angle}, 100%, 50%)`;
      context.fill();
    }

    // Add radial gradient for saturation
    let gradient = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, 'transparent');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Position sample
    this._selector.nativeElement.style.left = radius + 'px';
    this._selector.nativeElement.style.top = radius + 'px';
  }

  onPointerDown(event: PointerEvent) {
    this._canvas.nativeElement.setPointerCapture(event.pointerId);
    this.onPointerMove(event);
  }

  onPointerMove(event: PointerEvent) {
    if (!this._canvas.nativeElement.hasPointerCapture(event.pointerId)) return;
    let radius = this._canvas.nativeElement.width / 2;
    let rawX = event.offsetX - radius;
    let rawY = event.offsetY - radius;
    let length = Math.sqrt(rawX * rawX + rawY * rawY);
    let scale = length < radius ? 1 : radius / Math.sqrt(rawX * rawX + rawY * rawY);
    let sampleX = radius + rawX * scale;
    let sampleY = radius + rawY * scale;

    this._selector.nativeElement.style.left = sampleX + 'px';
    this._selector.nativeElement.style.top = sampleY + 'px';

    let context = this._canvas.nativeElement.getContext('2d')!;
    let imageData = context.getImageData(sampleX, sampleY, 1, 1).data;
    let [r, g, b] = imageData;
    this.Color = ((r << 24) + (g << 16) + (b << 8) + 0xff) >>> 0;
  }
}