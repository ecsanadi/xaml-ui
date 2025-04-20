import { Component, EventEmitter, HostListener, Input, Output } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { TextAlignment } from "../Common";

export type NumberInputMode = 'Float' | 'Integer';
export type NumberFormatter = (value: number) => string;

@Component({
  selector: 'NumberBox',
  template: `<input type="text" [disabled]="!IsEnabled" [value]="Text" (change)="onChange($event)" [placeholder]="PlaceholderText" [style]="{'text-align': TextAlignment}" (blur)="onBlur($event)"/>`,
  styleUrl: 'TextBox.scss'
})
export class NumberBox extends FrameworkElementComponent {
  @Input() IsEnabled: boolean = true;
  @Input() PlaceholderText: string = '';
  @Input() TextAlignment?: TextAlignment = 'Left';

  @Input() InputMode: NumberInputMode = 'Float';
  @Input() Minimum?: number;
  @Input() Maximum?: number;
  @Input() NumberFormatter: NumberFormatter = (value: number) => value.toString();

  @Output() ValueChange = new EventEmitter<number>();

  private _text = '';
  get Text() {
    return this._text;
  }

  private _value: number = NaN;
  @Input() get Value() {
    return this._value;
  }
  set Value(value: number) {
    if (value == this.Value) return;
    this._value = value;
    this.ValueChange.emit(value);
  }

  onChange(event: Event) {
    this._text = ((event.target) as HTMLInputElement).value;

    let value: number | undefined;
    switch (this.InputMode) {
      case 'Float':
        value = parseFloat(this._text);
        break;
      case 'Integer':
        value = parseInt(this._text);
        break;
    }

    if (!Number.isNaN(value)) {
      if (this.Minimum !== undefined && value < this.Minimum) value = this.Minimum;
      if (this.Maximum !== undefined && value > this.Maximum) value = this.Maximum;
    }
    this.Value = value;
  }

  onBlur(event: Event) {
    this._text = Number.isNaN(this.Value) ? '' : this.NumberFormatter(this.Value);
    ((event.target) as HTMLInputElement).value = this._text;
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: Event) {
    event.stopPropagation();
  }
}