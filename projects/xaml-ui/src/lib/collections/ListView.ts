import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelectorComponent, SelectorFooterTemplate, SelectorHeaderTemplate, SelectorItemTemplate } from "../primitives/Selector";
import { ScrollViewerComponent } from "../scrolling/ScrollViewer";
import { StackPanelComponent } from "../layout/StackPanel";

@Component({
  selector: 'ListView',
  imports: [CommonModule, ScrollViewerComponent, StackPanelComponent],
  template: `<ScrollViewer>
    <StackPanel Padding="2px 0">
      ${SelectorHeaderTemplate}
        <div class="item-selector"></div>
        <div class="item-content">${SelectorItemTemplate}</div>
      ${SelectorFooterTemplate}
    </StackPanel>
  </ScrollViewer>`,
  styleUrl: 'ListView.scss'
})
export class ListViewComponent extends SelectorComponent {

}