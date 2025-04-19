import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { ButtonComponent } from "./Button";
import { SelectorComponent, SelectorFooterTemplate, SelectorHeaderTemplate, SelectorItemTemplate } from "../primitives/Selector";
import { CommonModule } from "@angular/common";
import { ListViewComponent } from "../collections/ListView";
import { PopupComponent } from "../primitives/Popup";

@Component({
  selector: 'ComboBox',
  imports: [CommonModule, ButtonComponent, PopupComponent, ListViewComponent],
  template: `<Button>
    ${SelectorItemTemplate}
    <Popup #ButtonFlyout [VerticalOffset]="popupOffset">
      <ListView [ItemSource]="ItemSource" [(SelectedIndex)]="SelectedIndex"/>
    </Popup>
  </Button>`,
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

  constructor(private _changeDetector: ChangeDetectorRef) {
    super();
    this.SelectedIndexChange.subscribe(() => this.onSelectionChanged());
  }

  ngAfterViewInit(): void {
    //help the layout finish itself
    this._changeDetector.detectChanges();
  }

  get popupOffset() {
    console.log(-(this._selector?.GetElement(this.SelectedIndex)?.offsetTop ?? 0));
    return -(this._selector?.GetElement(this.SelectedIndex)?.offsetTop ?? 0);
  }

  onSelectionChanged() {
    if (this._popup) this._popup.IsOpen = false;
  }
}