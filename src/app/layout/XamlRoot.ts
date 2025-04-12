import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: 'XamlRoot',
  imports: [CommonModule],
  template: `<ng-container><ng-content/></ng-container>`,
  styles: `:host { 
    display: grid;    
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 10pt;
    background-color: #f3f3f3;
    color: #000000;

    @media (prefers-color-scheme: dark) {
      background-color: #202020;
      color: #ffffff;
    }
  }`
})
export class XamlRoot {
  
}