import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { SelectorComponent, SelectorItemTemplate } from "../primitives/Selector";
import { CommonModule } from "@angular/common";
import { ListViewComponent } from "../collections/ListView";
import { PopupComponent } from "../primitives/Popup";
import { DropDownButtonComponent } from "./DropDownButton";
import { Flyout2Component } from "../dialogs-and-flyouts/Flyout2";
import { FlexibleConnectedPositionStrategyOrigin } from "@angular/cdk/overlay";

@Component({
  selector: 'ComboBox',
  imports: [CommonModule, DropDownButtonComponent, Flyout2Component, ListViewComponent],
  template: `<DropDownButton [HorizontalContentAlignment]="HorizontalContentAlignment" [VerticalContentAlignment]="VerticalContentAlignment" [IsEnabled]="IsEnabled">
    ${SelectorItemTemplate}
    <Flyout2 Placement="Bottom" Padding="0" [Target]="target">
      <ListView [ItemSource]="ItemSource" [(SelectedIndex)]="SelectedIndex"  [HorizontalContentAlignment]="HorizontalContentAlignment" [VerticalContentAlignment]="VerticalContentAlignment"/>
    </Flyout2>
  </DropDownButton>`,
  styleUrl: 'ComboBox.scss'
})
export class ComboBoxComponent extends SelectorComponent implements AfterViewInit {
  get item() {
    return this.SelectedItem;
  }

  get index() {
    return this.SelectedIndex;
  }

  @ViewChild(ListViewComponent)
  private _selector?: SelectorComponent;

  @ViewChild(PopupComponent)
  private _popup?: PopupComponent;

  constructor(
    private _changeDetector: ChangeDetectorRef,
    private _host: ElementRef<HTMLElement>) {
    super();
    this.SelectedIndexChange.subscribe(() => this.onSelectionChanged());
  }

  protected get target(): FlexibleConnectedPositionStrategyOrigin {
    let rect = this._host.nativeElement.getBoundingClientRect();
    let popupOffset = -(this._selector?.GetElement(this.SelectedIndex)?.offsetTop ?? 0);
    console.log(popupOffset);

    return {x: rect.left, y: rect.top + popupOffset, width: rect.width};
  }

  ngAfterViewInit(): void {
    //help the layout finish itself
    this._changeDetector.detectChanges();
  }

  private onSelectionChanged() {
    if (this._popup) this._popup.IsOpen = false;
  }
}