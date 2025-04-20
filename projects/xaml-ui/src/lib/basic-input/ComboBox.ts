import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from "@angular/core";
import { SelectorComponent, SelectorItemTemplate } from "../primitives/Selector";
import { CommonModule } from "@angular/common";
import { ListViewComponent } from "../collections/ListView";
import { PopupComponent } from "../primitives/Popup";
import { DropDownButtonComponent } from "./DropDownButton";

@Component({
  selector: 'ComboBox',
  imports: [CommonModule, DropDownButtonComponent, PopupComponent, ListViewComponent],
  template: `<DropDownButton [HorizontalContentAlignment]="HorizontalContentAlignment" [VerticalContentAlignment]="VerticalContentAlignment" [IsEnabled]="IsEnabled">
    ${SelectorItemTemplate}
    <Popup #ButtonFlyout [VerticalOffset]="popupOffset">
      <ListView [ItemSource]="ItemSource" [(SelectedIndex)]="SelectedIndex"  [HorizontalContentAlignment]="HorizontalContentAlignment" [VerticalContentAlignment]="VerticalContentAlignment"/>
    </Popup>
  </DropDownButton>`,
  styleUrl: 'ComboBox.scss'
})
export class ComboBoxComponent extends SelectorComponent implements AfterViewInit {
  @Input() IsEnabled: boolean = true;

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

  constructor(private _changeDetector: ChangeDetectorRef) {
    super();
    this.SelectedIndexChange.subscribe(() => this.onSelectionChanged());
  }

  ngAfterViewInit(): void {
    //help the layout finish itself
    this._changeDetector.detectChanges();
  }

  private _popupOffset = -4;
  get popupOffset() {
    //Cache the value so the change detector will not complain    
    let popupOffset = -(this._selector?.GetElement(this.SelectedIndex)?.offsetTop ?? 0);
    if (popupOffset !== 0) this._popupOffset = popupOffset;
    return this._popupOffset;
  }

  onSelectionChanged() {
    if (this._popup) this._popup.IsOpen = false;
  }
}