import { Component } from "@angular/core";
import { ButtonComponent } from "./Button";
import { SelectorComponent, SelectorFooterTemplate, SelectorHeaderTemplate, SelectorItemTemplate } from "../primitives/Selector";
import { CommonModule } from "@angular/common";
import { ListViewComponent } from "../collections/ListView";

@Component({
  selector: 'ComboBox',
  imports: [CommonModule, ButtonComponent, ListViewComponent],
  template: `<Button (Click)="onButtonClick()">
    ${SelectorItemTemplate}
    <div class="backdrop" (click)="onBackdropClick($event)" *ngIf="isOpen"></div>
    <div class="container" [ngClass]="containerClass">
      <ListView class="content" [ItemSource]="ItemSource" [(SelectedIndex)]="SelectedIndex"/>
    </div>
  </Button>`,
  styleUrl: 'ComboBox.scss',
})
export class ComboBoxComponent extends SelectorComponent {
  get item() {
    return this.SelectedItem;
  }

  isOpen = false;

  get containerClass() {
    return this.isOpen ? 'flyout-open' : undefined;
  }

  onButtonClick() {
    this.isOpen = true;
    console.log('open');
  }

  onBackdropClick(event: Event) {
    this.isOpen = false;
    event.stopPropagation();
  }

  constructor() {
    super();
    this.SelectedIndexChange.subscribe(() => this.onSelectionChanged());
  }

  onSelectionChanged() {
    console.log('close');
    this.isOpen = false;
  }
}