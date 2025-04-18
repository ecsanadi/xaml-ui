import { CommonModule } from "@angular/common";
import { FrameworkElementComponent } from "../FrameworkElement";
import { AfterViewInit, Component, ElementRef, HostBinding, HostListener, Input, OnInit, ViewChild } from "@angular/core";
import { ScrollMode } from "../Common";

@Component({
  selector: 'ScrollViewer',
  imports: [CommonModule],
  template: `<div #content class="content" [ngStyle]="contentStyle" (scroll)="updateScrollPosition()"><ng-content/></div>
  <div #scrollbar class="scrollbar"><div #thumb class="thumb" (pointerdown)="onPointerDown($event)" (pointermove)="onPointerMove($event)" (pointerup)="onPointerUp($event)"></div></div>`,
  styleUrl: 'ScrollViewer.scss'
})
export class ScrollViewerComponent extends FrameworkElementComponent implements AfterViewInit {
  @Input() VerticalScrollMode: ScrollMode = 'Enabled';

  @ViewChild('content')
  private _content!: ElementRef<HTMLDivElement>;

  @ViewChild('scrollbar')
  private _scrollbar!: ElementRef<HTMLDivElement>;

  @ViewChild('thumb')
  private _thumb!: ElementRef<HTMLDivElement>;

  private _isScrolling = false;
  private _startPointerY = 0;
  private _startScrollY = 0;

  ngAfterViewInit(): void {
    this.updateScrollPosition();
  }

  updateScrollPosition() {
    let content = this._content.nativeElement;
    let scrollbar = this._scrollbar.nativeElement;
    let thumb = this._thumb.nativeElement;

    let scrollPercent = content.scrollTop / (content.scrollHeight - content.clientHeight);
    let thumbHeight = scrollbar.offsetHeight * (content.clientHeight / content.scrollHeight);
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.top = `${scrollPercent * (scrollbar.offsetHeight - thumbHeight)}px`;
  }

  onPointerDown(event: PointerEvent) {
    if (event.buttons !== 1) return;

    this._thumb.nativeElement.setPointerCapture(event.pointerId);
    this._isScrolling = true;
    this._startPointerY = event.clientY;
    this._startScrollY = this._content.nativeElement.scrollTop;
  }

  onPointerMove(event: PointerEvent) {
    if (!this._isScrolling) return;
    if (event.buttons !== 1) {
      this._isScrolling = false;
      return;
    }

    let content = this._content.nativeElement;
    let scrollbar = this._scrollbar.nativeElement;
    let thumb = this._thumb.nativeElement;
    let deltaY = event.clientY - this._startPointerY;

    const scrollPercent = deltaY / (scrollbar.offsetHeight - thumb.offsetHeight);
    content.scrollTop = this._startScrollY + scrollPercent * (content.scrollHeight - content.clientHeight);
  }

  onPointerUp(event: PointerEvent) {
    if (event.buttons !== 1) return;

    this._isScrolling = false;
    this._thumb.nativeElement.releasePointerCapture(event.pointerId);
  }

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

  get contentStyle() {
    return {
      'overflow-y': ScrollViewerComponent.toOverflow(this.VerticalScrollMode)
    };
  }
}