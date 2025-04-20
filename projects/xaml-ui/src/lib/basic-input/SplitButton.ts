import { Component, ContentChild, EventEmitter, Input, Output } from "@angular/core";
import { ButtonComponent } from "./Button";
import { DropDownButtonComponent } from "./DropDownButton";
import { GridModule } from "../layout/Grid";
import { PopupComponent } from "../primitives/Popup";
import { CommonModule } from "@angular/common";
import { FrameworkElementComponent } from "../FrameworkElement";

@Component({
  selector: 'SplitButton',
  template: `<Grid ColumnDefinitions="1fr auto">
    <Button CornerRadius="4px 0 0 4px" [IsEnabled]="IsEnabled" (Click)="onButtonClick()" [ngClass]="buttonClass"><ng-content/></Button>
    <DropDownButton CornerRadius="0 4px 4px 0" Width="12px" (Click)="onDropDownClick()" [IsEnabled]="IsEnabled"/>
  </Grid>`,
  imports: [CommonModule, ButtonComponent, DropDownButtonComponent, GridModule]
})
export class SplitButtonComponent extends FrameworkElementComponent {
  @Input() IsEnabled: boolean = true;

  @Output() Click = new EventEmitter();

  @ContentChild('ButtonFlyout')
  private _popup?: PopupComponent;

  get buttonClass() {
    return this._popup?.IsOpen ? 'popup-open' : undefined;
  }

  onButtonClick() {
    if (!this.IsEnabled) return;

    this.Click.emit();
  }

  onDropDownClick() {
    if (!this._popup || !this.IsEnabled) return;

    this._popup.IsOpen = true;
  }
}