import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList } from "@angular/core";
import { Border } from "../layout/Border";
import { StackPanel } from "../layout/StackPanel";

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
export class RadioButton extends Border {
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
  template: `<ng-container><ng-content/></ng-container>`,
  styles: `:host { 
    display: flex;
  }`
})
export class RadioButtonGroup extends StackPanel implements AfterContentInit {
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

  @ContentChildren(RadioButton)
  private _children!: QueryList<RadioButton>;

  private static _nextId = 1;
  private readonly _id = RadioButtonGroup._nextId++;

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