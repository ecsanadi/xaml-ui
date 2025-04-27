import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { Color, colorToRgb, rgbToHsl } from "../Color";

@Component({
  selector: 'ColorPicker',
  template: `<canvas #canvas (pointerdown)="onPointerDown($event)" (pointermove)="onPointerMove($event)"></canvas><div #selector class="selector"></div>`,
  styleUrl: 'ColorPicker.scss'
})
export class ColorPickerComponent extends FrameworkElementComponent implements AfterViewInit {

  private _color: Color = 0xffffffff;
  get Color() {
    return this._color;
  }
  @Input() set Color(value: Color) {    
    this.setColor(value);
    this.updateSelectorPosition();
  }

  private setColor(value: Color) {
    if(this._color === value) return;

    this._color = value;
    this.ColorChange.emit(value);
  }

  @Output() ColorChange = new EventEmitter<Color>();

  @ViewChild('canvas')
  private _canvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('selector')
  private _selector!: ElementRef<HTMLDivElement>;

  private _context!: CanvasRenderingContext2D;

  ngAfterViewInit(): void {
    let canvas = this._canvas.nativeElement;
    canvas.width = parseInt(this.Width ?? '300');
    canvas.height = parseInt(this.Height ?? '300');

    let context = this._context = canvas.getContext('2d', { willReadFrequently: true })!;
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
    this.updateSelectorPosition();
  }

  protected onPointerDown(event: PointerEvent) {
    this._canvas.nativeElement.setPointerCapture(event.pointerId);
    this.onPointerMove(event);
  }

  protected onPointerMove(event: PointerEvent) {
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

    let imageData = this._context.getImageData(sampleX, sampleY, 1, 1).data;
    let [r, g, b] = imageData;
    let color = ((0xff << 24) + (r << 16) + (g << 8) + b) >>> 0;
    this.setColor(color);
  }

  private updateSelectorPosition() {
    if (!this._canvas) return;

    let rgb = colorToRgb(this.Color);
    let hsl = rgbToHsl(rgb);

    let radius = this._canvas.nativeElement.width / 2;
    let angle = hsl.h / 180 * Math.PI;
    let length = hsl.s / 100 * radius;
    let x = radius + Math.cos(angle) * length;
    let y = radius + Math.sin(angle) * length;
    this._selector.nativeElement.style.left = x + 'px';
    this._selector.nativeElement.style.top = y + 'px';
  }
}