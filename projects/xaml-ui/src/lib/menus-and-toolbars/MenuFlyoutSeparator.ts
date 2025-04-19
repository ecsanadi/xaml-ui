import { Component } from "@angular/core";
import { MenuFlyoutItemBase } from "./MenuFlyoutItemBase";

@Component({
  selector: 'MenuFlyoutSeparator',
  template: `<div class="separator"></div>`,
  styleUrl: 'MenuFlyoutSeparator.scss'
})
export class MenuFlyoutSeparator extends MenuFlyoutItemBase {

}