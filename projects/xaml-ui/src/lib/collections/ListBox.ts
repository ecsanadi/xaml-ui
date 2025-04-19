import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelectorComponent, SelectorItemTemplate } from "../primitives/Selector";

@Component({
  selector: 'ListBox',
  imports: [CommonModule],
  template: `<div *ngFor="let item of ItemSource; index as index; trackBy: getValue" class="item" [ngClass]="{'selected': index == SelectedIndex}" (click)="onItemClick($event, index, item)" [id]="'xaml-selector-'+_id+'-item-'+index" [ngStyle]="{'align-content': alignContent, 'justify-content': justifyContent}">
    ${SelectorItemTemplate}
  </div>`,
  styleUrl: 'ListBox.scss'
})
export class ListBoxComponent extends SelectorComponent {
  
}