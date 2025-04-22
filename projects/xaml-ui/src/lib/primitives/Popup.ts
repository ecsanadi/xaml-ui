import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, Input, Output, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'Popup',
  imports: [CommonModule],
  template: `<div class="popup-backdrop" (click)="onBackdropClick($event)" (contextmenu)="onBackdropClick($event)" *ngIf="IsOpen"></div>
    <div #container class="popup-container" [ngClass]="containerClass">
      <div class="popup-content" *ngIf="isRendered"><ng-content/></div>
    </div>`,
  styleUrl: 'Popup.scss',
  host: {
    class: 'popup'
  }
})
export class PopupComponent {
  isRendered = false;

  private _isRenderedTimeout: any;

  private _isOpen = false;
  @Input() get IsOpen() {
    return this._isOpen;
  };
  set IsOpen(value: boolean) {
    this._isOpen = value;

    if (this._isRenderedTimeout !== undefined) {
      clearTimeout(this._isRenderedTimeout);
    }

    if (value) {
      this.isRendered = true;
    }
    else {
      this._isRenderedTimeout = setTimeout(() => {
        this.isRendered = false;
      }, 250);
    }

    if (value && this._container) {
      this._container.nativeElement.style.transform = `translate(${this.HorizontalOffset}px, ${this.VerticalOffset - 4}px)`;
    }
  };

  @Output() IsOpenChange = new EventEmitter<boolean>();

  @Input() VerticalOffset = 0;
  @Input() HorizontalOffset = 0;

  @ViewChild('container')
  private _container?: ElementRef<HTMLElement>;

  Show() {
    this.IsOpen = true;
  }

  Hide() {
    this.IsOpen = false;
  }

  protected get containerClass() {
    return this.IsOpen ? 'popup-open' : undefined;
  }

  protected onBackdropClick(event: Event) {
    this.Hide();
    event.stopPropagation();
  }
}