import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { TextAlignment } from "../Common";
import { RepeatButtonComponent } from "../basic-input/RepeatButton";
import { FontIconComponent } from "../icons/FontIcon";
import { CommonModule } from "@angular/common";

export type NumberInputMode = 'Float' | 'Integer';
export type NumberFormatter = (value: number) => string;

@Component({
  selector: 'NumberBox',
  template: `<label>
    <div class="icon">&#xEC8F;</div>
    <input #input type="text" [disabled]="!IsEnabled" [value]="Text" (change)="onChange()" [placeholder]="PlaceholderText" [style]="{'text-align': TextAlignment}" (blur)="onBlur()" (keydown)="onKeyDown($event)"/>
    <div class="popup">
      <RepeatButton Class="InlineButtonStyle" (Click)="onIncreaseClick()" [Delay]="500" [Interval]="50"><FontIcon Glyph="&#xE70E;"/></RepeatButton>
      <RepeatButton Class="InlineButtonStyle" (Click)="onDecreaseClick()" [Delay]="500" [Interval]="50"><FontIcon Glyph="&#xE70D;"/></RepeatButton>
    </div>
    <div class="unit" *ngIf="Unit !== undefined">{{Unit}}</div>    
  </label>`,
  styleUrls: ['TextBox.scss', 'NumberBox.scss'],
  imports: [CommonModule, RepeatButtonComponent, FontIconComponent]
})
export class NumberBoxComponent extends FrameworkElementComponent {
  @Input() IsEnabled: boolean = true;
  @Input() PlaceholderText: string = '';
  @Input() IsPlaceholderEditable: boolean = false;
  @Input() TextAlignment?: TextAlignment = 'Left';

  @Input() InputMode: NumberInputMode = 'Float';
  @Input() Minimum: number = -Infinity;
  @Input() Maximum: number = Infinity;
  @Input() SmallChange: number = 1;
  @Input() LargeChange: number = 10;
  @Input() NumberFormatter: NumberFormatter = (value: number) => value.toString();
  @Input() Unit?: string;

  @Output() ValueChange = new EventEmitter<number>();

  @ViewChild('input')
  private _input!: ElementRef<HTMLInputElement>;

  private _text = '';
  get Text() {
    return this._text;
  }

  private _value: number = NaN;
  @Input() get Value() {
    return this._value;
  }
  set Value(value: number) {
    this.setValue(value);
    this.updateText();
  }

  private setValue(value: number) {
    value = this.clampValue(value);
    if (value == this.Value) return;

    this._value = value;
    this.ValueChange.emit(value);
  }

  constructor() {
    super();
    this.TextAlignment = 'Right';
  }

  protected onChange() {
    this._text = this._input.nativeElement.value;

    let value: number | undefined;
    switch (this.InputMode) {
      case 'Float':
        value = parseFloat(this._text);
        break;
      case 'Integer':
        value = parseInt(this._text);
        break;
    }

    this.setValue(value);
  }

  private clampValue(value: number) {
    if (!Number.isNaN(value)) {
      if (this.Minimum !== undefined && value < this.Minimum) value = this.Minimum;
      if (this.Maximum !== undefined && value > this.Maximum) value = this.Maximum;
    }
    return value;
  }

  protected onIncreaseClick() {
    this.Value += this.SmallChange;
  }

  protected onDecreaseClick() {
    this.Value -= this.SmallChange;
  }

  protected onBlur() {
    this.updateText();
    this._input.nativeElement.value = this._text;

    if (this.IsPlaceholderEditable && this._input.nativeElement.value === this.PlaceholderText) {
      this._input.nativeElement.value = '';
      this.onChange();
    }
  }

  protected onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.Value += this.SmallChange;
        break;
      case 'ArrowDown':
        this.Value -= this.SmallChange;
        break;
      case 'PageUp':
        this.Value += this.LargeChange;
        break;
      case 'PageDown':
        this.Value -= this.LargeChange;
        break;
    }
  }

  @HostListener('click', [])
  private onClick() {
    this._input.nativeElement.focus();
  }

  @HostListener('focusin', [])
  private onFocusIn() {    
    if (this.IsPlaceholderEditable && Number.isNaN(this.Value)) {
      this._input.nativeElement.value = this.PlaceholderText;
      this.onChange();
    }

    this._input.nativeElement.select();
  }

  private updateText() {
    this._text = Number.isNaN(this.Value) ? '' : this.NumberFormatter(this.Value);
  }

  @HostListener('contextmenu', ['$event'])
  private onContextMenu(event: Event) {
    event.stopPropagation();
  }
}