import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from "@angular/core";
import { FrameworkElementComponent } from "../layout/FrameworkElement";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'ListBox',
  imports: [CommonModule],
  template: `<div *ngFor="let item of ItemSource; index as index; trackBy: getValue" class="item" [ngClass]="{'selected': index == SelectedIndex}" (click)="onItemClick(index, item)">
    <ng-container *ngIf="ItemTemplate">
      <ng-container *ngTemplateOutlet="ItemTemplate; context: { $implicit: item }"/>
    </ng-container>
    <ng-container *ngIf="!ItemTemplate">{{ DisplayMemberPath ? item[DisplayMemberPath] : item }}</ng-container>
  </div>`,
  styleUrl: 'ListBox.scss'
})
export class ListBoxComponent extends FrameworkElementComponent {
  @Input() ItemSource?: any[];
  @ContentChild(TemplateRef) ItemTemplate!: TemplateRef<any>;

  @Input() SelectedIndex: number = -1;
  @Output() SelectedIndexChange = new EventEmitter<number>();

  @Input() SelectedValue: any = null;
  @Output() SelectedValueChange = new EventEmitter<any>();

  @Input() DisplayMemberPath?: string;
  @Input() SelectedValuePath?: string;

  getValue(index: number, item: any) {
    return this.SelectedValuePath ? item[this.SelectedValuePath] : item;
  }

  onItemClick(index: number, item: any) {
    this.SelectedIndex = index;
    this.SelectedIndexChange.emit(index);

    this.SelectedValue = this.getValue(index, item);
    this.SelectedValueChange.emit(index);
  }

  override get overflow() {
    return 'auto';
  }
}