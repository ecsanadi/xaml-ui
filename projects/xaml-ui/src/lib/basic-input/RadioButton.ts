import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList } from "@angular/core";
import { BorderComponent } from "../layout/Border";
import { StackPanelComponent } from "../layout/StackPanel";

@Component({
  selector: 'RadioButton',
  template: `<label class="container">
    <input type="radio" [name]="Group" [value]="Value" [checked]="IsChecked" (change)="onIsCheckedChange($event)" [disabled]="!IsEnabled">
    <div class="radioButton">
      <div class="circle"></div>
    </div>
    <div class="content">
      <ng-content/>
    </div>
  </label>`,
  styleUrl: 'RadioButton.scss'
})
export class RadioButtonComponent extends BorderComponent {
  @Input() IsEnabled = true;

  @Input() IsChecked = false;
  @Output() IsCheckedChange = new EventEmitter<boolean>();

  @Input() Group = "";
  @Input() Value: any;

  onIsCheckedChange(event: Event) {
    this.IsChecked = ((event.target) as HTMLInputElement).checked;
    this.IsCheckedChange.emit(this.IsChecked);
  }
}

@Component({
  selector: 'RadioButtonGroup',
  template: `<ng-content/>`,
  styles: `:host { 
    display: contents;
  }`
})
export class RadioButtonGroup extends StackPanelComponent implements AfterContentInit {
  private _value: any;

  @Input()
  set Value(value: any) {
    if (this._children) {
      for (let item of this._children) {
        if (item.Value = value) {
          item.IsChecked = true;
          break;
        }
      }
    } else {
      this._value = value;
    }
  }

  get Value() {
    return this._value;
  }

  @Output() ValueChange = new EventEmitter<boolean>();

  @ContentChildren(RadioButtonComponent)
  private _children!: QueryList<RadioButtonComponent>;

  ngAfterContentInit() {
    let index = 0;
    for (let item of this._children) {
      item.Group = 'xaml-radio-button-group-' + this._id;

      if (item.Value === undefined) item.Value = index++;
      if (item.Value === this.Value) item.IsChecked = true;

      item.IsCheckedChange.subscribe(p => {
        this.Value = item.Value;
        this.ValueChange.emit(item.Value);
      });
    }
  }
}