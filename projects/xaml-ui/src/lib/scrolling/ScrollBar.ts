import { Component, ElementRef, HostBinding, Input, ViewChild } from "@angular/core";
import { Orientation } from "../Common";
import { FrameworkElementComponent } from "../FrameworkElement";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'ScrollBar',
  imports: [CommonModule],
  template: `<div class="buttons">{{decreaseGlyph}}</div>
    <div #track class="track">
      <div #thumb class="thumb" [ngStyle]="thumbStyle" (pointerdown)="onPointerDown($event)" (pointermove)="onPointerMove($event)" (pointerup)="onPointerUp($event)"></div>
    </div>
    <div class="buttons">{{increaseGlyph}}</div>`,
  styleUrl: 'ScrollBar.scss'
})
export class ScrollBar extends FrameworkElementComponent {
  @Input() Orientation: Orientation = 'Vertical';

  @Input() ViewportSize: number = 0;
  @Input() ScrollSize: number = 0;
  @Input() Value: number = 0;

  @ViewChild('track')
  private _track!: ElementRef<HTMLDivElement>;

  @ViewChild('thumb')
  private _thumb!: ElementRef<HTMLDivElement>;

  private _isScrolling = false;
  private _startPointerPosition = 0;
  private _startScrollPosition = 0;

  get decreaseGlyph() {
    return this.Orientation === 'Vertical' ? '\ueddb' : '\uedd9';
  }

  get increaseGlyph() {
    return this.Orientation === 'Vertical' ? '\ueddc' : '\uedda';
  }

  @HostBinding('class')
  get class() {
    return this.Orientation.toLowerCase();
  }

  getElementSize(element: HTMLElement) {
    return this.Orientation === 'Vertical' ? element.offsetHeight : element.offsetWidth;
  }

  getPointerPosition(event: PointerEvent) {
    return this.Orientation === 'Vertical' ? event.clientY : event.clientX;
  }

  get thumbStyle() {
    if (!this._track) return {};

    let trackLength = this.getElementSize(this._track.nativeElement);
    let scrollPosition = this.Value / (this.ScrollSize - this.ViewportSize);
    let size = trackLength * (this.ViewportSize / this.ScrollSize);
    let position = scrollPosition * (trackLength - size);

    switch (this.Orientation) {
      case 'Vertical':
        return {
          'height': size + 'px',
          'top': position + 'px'
        };
      case 'Horizontal':
        return {
          'width': size + 'px',
          'left': position + 'px'
        };
    }
  }

  onPointerDown(event: PointerEvent) {
    if (event.buttons !== 1) return;

    this._thumb.nativeElement.setPointerCapture(event.pointerId);
    this._isScrolling = true;
    this._startPointerPosition = this.getPointerPosition(event);
    this._startScrollPosition = this.Value;
  }

  onPointerMove(event: PointerEvent) {
    if (!this._isScrolling) return;
    if (event.buttons !== 1) {
      this._isScrolling = false;
      return;
    }

    let delta = this.getPointerPosition(event) - this._startPointerPosition;
    let trackLength = this.getElementSize(this._track.nativeElement);
    let thumbLength = this.getElementSize(this._thumb.nativeElement);

    let scrollPercent = delta / (trackLength - thumbLength);
    let scrollRange = this.ScrollSize - this.ViewportSize;
    let value = this._startScrollPosition + scrollPercent * (scrollRange);
    
    if(value > scrollRange) value = scrollRange;
    if(value < 0) value = 0;

    this.Value = value;
  }

  onPointerUp(event: PointerEvent) {
    if (event.buttons !== 1) return;

    this._isScrolling = false;
    this._thumb.nativeElement.releasePointerCapture(event.pointerId);
  }
}