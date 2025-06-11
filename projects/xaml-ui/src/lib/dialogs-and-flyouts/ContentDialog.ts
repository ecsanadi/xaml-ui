import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DialogPresenter } from "../primitives/DialogPresenter";
import { GridModule } from "../layout/Grid";
import { ButtonComponent } from "../basic-input/Button";
import { CommonModule } from "@angular/common";
import { Dialog } from "./Dialog";

export enum ContentDialogResult {
  None,
  Primary,
  Secondary
}

export enum ContentDialogButton {
  None,
  Primary,
  Secondary,
  Close
}

@Component({
  selector: 'ContentDialog',
  template: `<ng-template #template>
    <DialogPresenter>
      <div Header>{{Title}}</div>
      {{Content}}
      <ng-content/>
      <Grid RowDefinitions="auto" Orientation="Horizontal" ColumnSpacing="6px" AutoColumnDefinition="minmax(0, 1fr)" Footer>
        <Button *ngIf="PrimaryButtonText !== undefined" [IsEnabled]="IsPrimaryButtonEnabled" (Click)="onPrimaryButtonClicked()" [class.AccentButtonStyle]="isPrimaryButtonDefault">{{PrimaryButtonText}}</Button>
        <Button *ngIf="SecondaryButtonText !== undefined" [IsEnabled]="IsSecondaryButtonEnabled" (Click)="onSecondaryButtonClicked()" [class.AccentButtonStyle]="isSecondaryButtonDefault">{{SecondaryButtonText}}</Button>
        <Button *ngIf="CloseButtonText !== undefined" (Click)="onCloseButtonClicked()" [class.AccentButtonStyle]="isCloseButtonDefault">{{CloseButtonText}}</Button>
      </Grid>
    </DialogPresenter>
  </ng-template>`,
  styles: ``,
  imports: [DialogPresenter, GridModule, ButtonComponent, CommonModule]
})
export class ContentDialog extends Dialog {
  @Input() Title?: string;

  @Input() PrimaryButtonText?: string;
  @Input() IsPrimaryButtonEnabled: boolean = true;
  @Output() PrimaryButtonClicked = new EventEmitter();

  @Input() SecondaryButtonText?: string;
  @Input() IsSecondaryButtonEnabled: boolean = true;
  @Output() SecondaryButtonClicked = new EventEmitter();

  @Input() CloseButtonText?: string;
  @Output() CloseButtonClicked = new EventEmitter();

  @Input() Content: any;

  @Input() DefaultButton = ContentDialogButton.None;

  private _result = ContentDialogResult.None;

  get Result(): ContentDialogResult {
    return this._result;
  }

  set Result(value: ContentDialogResult) {
    this._result = value;
    this.Hide();
  }

  protected onPrimaryButtonClicked() {
    this.PrimaryButtonClicked.emit();
    this.Result = ContentDialogResult.Primary;
  }

  protected onSecondaryButtonClicked() {
    this.SecondaryButtonClicked.emit();
    this.Result = ContentDialogResult.Secondary;
  }

  protected onCloseButtonClicked() {
    this.CloseButtonClicked.emit();
    this.Result = ContentDialogResult.None;
  }

  protected get isPrimaryButtonDefault() {
    return this.DefaultButton === ContentDialogButton.Primary;
  }

  protected get isSecondaryButtonDefault() {
    return this.DefaultButton === ContentDialogButton.Secondary;
  }

  protected get isCloseButtonDefault() {
    return this.DefaultButton === ContentDialogButton.Close;
  }

  override async ShowAsync() {
    await super.ShowAsync();

    return this._result;
  }
}