import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelectorComponent, SelectorFooterTemplate, SelectorHeaderTemplate, SelectorItemTemplate } from "../primitives/Selector";

@Component({
  selector: 'ListBox',
  imports: [CommonModule],
  template: `${SelectorHeaderTemplate}${SelectorItemTemplate}${SelectorFooterTemplate}`,
  styleUrl: 'ListBox.scss'
})
export class ListBoxComponent extends SelectorComponent {
  
}