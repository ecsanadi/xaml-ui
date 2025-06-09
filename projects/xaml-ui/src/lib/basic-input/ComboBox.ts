import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { SelectorComponent, SelectorItemTemplate } from "../primitives/Selector";
import { CommonModule } from "@angular/common";
import { ListViewComponent } from "../collections/ListView";
import { DropDownButtonComponent } from "./DropDownButton";
import { FlyoutComponent } from "../dialogs-and-flyouts/Flyout";
import { FlexibleConnectedPositionStrategyOrigin } from "@angular/cdk/overlay";
import { FlyoutBaseComponent } from "../primitives/FlyoutBase";

@Component({
  selector: 'ComboBox',
  imports: [CommonModule, DropDownButtonComponent, FlyoutComponent, ListViewComponent],
  template: `<DropDownButton [HorizontalContentAlignment]="HorizontalContentAlignment" [VerticalContentAlignment]="VerticalContentAlignment" [IsEnabled]="IsEnabled">
    ${SelectorItemTemplate}
    <Flyout Placement="Cover" Padding="0" [Target]="target" (IsOpenChange)="onIsOpenChanged($event)">
      <ListView [ItemSource]="ItemSource" [(SelectedIndex)]="SelectedIndex"  [HorizontalContentAlignment]="HorizontalContentAlignment" [VerticalContentAlignment]="VerticalContentAlignment"/>
    </Flyout>
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

  @ViewChild('xaml-flyout')
  private _popup?: FlyoutBaseComponent;

  constructor(
    private _changeDetector: ChangeDetectorRef,
    private _host: ElementRef<HTMLElement>) {
    super();
    this.SelectedIndexChange.subscribe(() => this.onSelectionChanged());
  }

  protected target: FlexibleConnectedPositionStrategyOrigin | null = null;

  protected onIsOpenChanged(value: boolean) {
    if (!value) return;
    let rect = this._host.nativeElement.getBoundingClientRect();
    let popupOffset = -(this._selector?.GetElement(this.SelectedIndex)?.offsetTop ?? 0);
    this.target = { x: rect.left + 3, y: rect.top + popupOffset - 4, width: rect.width };
  }

  ngAfterViewInit(): void {
    //help the layout finish itself
    this._changeDetector.detectChanges();
  }

  private onSelectionChanged() {
    if (this._popup) this._popup.IsOpen = false;
  }
}