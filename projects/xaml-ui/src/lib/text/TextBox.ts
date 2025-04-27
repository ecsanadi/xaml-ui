import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, output, ViewChild } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { TextAlignment, TextWrapping } from "../Common";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'TextBox',
  imports: [CommonModule],
  template: `<input #input *ngIf="TextWrapping === 'NoWrap'" type="text" [disabled]="!IsEnabled" [value]="Text" (input)="onInput($event)" [placeholder]="PlaceholderText" [style]="{'text-align': TextAlignment}"/>
  <textarea *ngIf="TextWrapping === 'Wrap'" [disabled]="!IsEnabled" [value]="Text" (change)="onInput($event)" [placeholder]="PlaceholderText" [style]="{'text-align': TextAlignment}"></textarea>`,
  styleUrl: 'TextBox.scss'
})
export class TextBoxComponent extends FrameworkElementComponent {
  @Input() IsEnabled: boolean = true;
  @Input() PlaceholderText: string = '';
  @Input() TextAlignment?: TextAlignment = 'Left';
  @Input() TextWrapping: TextWrapping = 'NoWrap';

  @ViewChild('input')
  private _input!: ElementRef<HTMLInputElement>;
  
  private _text = '';
  get Text() {
    return this._text;
  }
  @Input() set Text(value: string) {
    if(value == this._text) return;

    this._text = value;
    this.TextChange.emit(value);
  }
  @Output() TextChange = new EventEmitter<string>();

  protected onInput(event: Event) {
    this.Text = ((event.target) as HTMLInputElement).value;
  }

  @HostBinding('class.disabled')
  private get disabled() {
    return !this.IsEnabled;
  }

  @HostListener('click', [])
  private onClick() {
    this._input.nativeElement.focus();
  }

  @HostListener('contextmenu', ['$event'])
  private onContextMenu(event: Event) {
    event.stopPropagation();
  }

  Focus() {
    setTimeout(() => {
      this._input.nativeElement.focus();
    }, 0);
  }
}