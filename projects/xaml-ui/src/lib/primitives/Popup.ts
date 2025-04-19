import { Component, ElementRef, EventEmitter, HostBinding, Input, Output, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'Popup',
  imports: [CommonModule],
  template: `<div class="popup-backdrop" (click)="onBackdropClick($event)" *ngIf="IsOpen"></div>
    <div #container class="popup-container" [ngClass]="containerClass">
      <div class="popup-content"><ng-content/></div>
    </div>`,
  styleUrl: 'Popup.scss',
  host: {
    class: 'popup'
  }
})
export class PopupComponent {
  private _isOpen = false;
  @Input() get IsOpen() {
    return this._isOpen;
  };
  set IsOpen(value: boolean) {
    this._isOpen = value;

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

  get containerClass() {
    return this.IsOpen ? 'popup-open' : undefined;
  }

  onBackdropClick(event: Event) {
    this.Hide();
    event.stopPropagation();
  }
}