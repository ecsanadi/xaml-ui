import { Component, EventEmitter, HostBinding, Input, Output, output } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { TextAlignment, TextWrapping } from "../Common";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'TextBox',
  imports: [CommonModule],
  template: `
  <input *ngIf="TextWrapping === 'NoWrap'" type="text" [disabled]="!IsEnabled" [value]="Text" (change)="onChange($event)" [placeholder]="PlaceholderText" [style]="{'text-align': TextAlignment}"/>
  <textarea *ngIf="TextWrapping === 'Wrap'" [disabled]="!IsEnabled" [value]="Text" (change)="onChange($event)" [placeholder]="PlaceholderText" [style]="{'text-align': TextAlignment}"></textarea>`,
  styleUrl: 'TextBox.scss'
})
export class TextBoxComponent extends FrameworkElementComponent {
  @Input() IsEnabled: boolean = true;
  @Input() PlaceholderText: string = '';
  @Input() Text: string = '';
  @Output() TextChange = new EventEmitter<string>();
  @Input() TextAlignment?: TextAlignment = 'Left';
  @Input() TextWrapping: TextWrapping = 'NoWrap';

  onChange(event: Event) {
    this.Text = ((event.target) as HTMLInputElement).value;
    this.TextChange.emit(this.Text);
  }
}