import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelectorComponent, SelectorItemTemplate } from "../primitives/Selector";
import { ScrollViewerComponent } from "../scrolling/ScrollViewer";
import { StackPanelComponent } from "../layout/StackPanel";

@Component({
  selector: 'ListView',
  imports: [CommonModule, ScrollViewerComponent, StackPanelComponent],
  template: `<ScrollViewer>
    <StackPanel Padding="2px 0">
      <div *ngFor="let item of ItemSource; index as index; trackBy: getValue" class="item" [ngClass]="{'selected': index == SelectedIndex}" (click)="onItemClick($event, index, item)" [id]="'xaml-selector-'+_id+'-item-'+index">
        <div class="item-selector"></div>
        <div class="item-content" [ngStyle]="{'align-content': alignContent, 'justify-content': justifyContent}">${SelectorItemTemplate}</div>
      </div>
    </StackPanel>
  </ScrollViewer>`,
  styleUrl: 'ListView.scss'
})
export class ListViewComponent extends SelectorComponent {

}