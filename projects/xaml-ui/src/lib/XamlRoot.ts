import { Component, HostListener } from "@angular/core";

@Component({
  selector: 'XamlRoot',
  template: `<ng-content/>`,
  styleUrl: 'XamlRoot.scss'
})
export class XamlRootComponent {

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: Event) {
    event.preventDefault();
  }

}