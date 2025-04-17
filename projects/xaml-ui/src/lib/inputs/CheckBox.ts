import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Border } from "../layout/Border";

@Component({
  selector: 'CheckBox',
  template: `<label class="container">
    <input type="checkbox" [checked]="IsChecked" (change)="onIsCheckedChange($event)" [disabled]="!IsEnabled">
    <div class="checkBox">
      <div class="checkMark">&#xE73E;</div>
    </div>
    <div class="content">
      <ng-content/>
    </div>
  </label>`,
  styleUrl: 'CheckBox.scss'
})
export class CheckBox extends Border {
  @Input() IsEnabled = true;
  @Input() IsChecked = false;
  @Output() IsCheckedChange = new EventEmitter<boolean>();

  onIsCheckedChange(event: Event) {
    this.IsChecked = ((event.target) as HTMLInputElement).checked;
    this.IsCheckedChange.emit(this.IsChecked);
  }
}