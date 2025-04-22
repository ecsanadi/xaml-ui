import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, Optional, Output, QueryList } from "@angular/core";
import { BorderComponent } from "../layout/Border";
import { StackPanelComponent } from "../layout/StackPanel";

@Component({
  selector: 'RadioButton',
  template: `<label class="container">
    <input type="radio" [name]="Group" [value]="Value" [checked]="IsChecked" (change)="onChange($event)" [disabled]="!IsEnabled">
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

  protected onChange(event: Event) {
    this.IsChecked = ((event.target) as HTMLInputElement).checked;
    this.IsCheckedChange.emit(this.IsChecked);
  }

  constructor(@Optional() private _group: RadioButtonGroup) {
    super();
    if (this._group) this._group.registerOption(this);
  }
}

@Component({
  selector: 'RadioButtonGroup',
  template: `<ng-content/>`,
  styles: `:host { 
    display: contents;
  }`
})
export class RadioButtonGroup extends StackPanelComponent {
  private _value: any;

  @Input()
  set Value(value: any) {
    if (this._children) {
      for (let item of this._children) {
        if (item.Value === value) {
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

  @Output() ValueChange = new EventEmitter<any>();

  private _children: RadioButtonComponent[] = [];

  registerOption(child: RadioButtonComponent) {
    child.Group = 'xaml-radio-button-group-' + this._id;
    
    if (child.Value === undefined) child.Value = this._children.length;
    if (child.Value === this.Value) child.IsChecked = true;

    child.IsCheckedChange.subscribe(p => {
      this.Value = child.Value;
      this.ValueChange.emit(child.Value);
    });

    this._children.push(child);
  }
}