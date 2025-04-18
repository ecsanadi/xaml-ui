import { Component } from "@angular/core";

@Component({
  selector: 'XamlRoot',
  template: `<ng-content/>`,
  styles: `:host { 
    display: grid;    
    background-color: #f3f3f3;
    overflow: hidden;

    &::ng-deep * {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 10pt;
      color: #000000;
    }

    @media (prefers-color-scheme: dark) {
      background-color: #202020;

      &::ng-deep * {
        color: #ffffff;
      }
    }
  }`
})
export class XamlRootComponent {

}