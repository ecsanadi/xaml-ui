import { Component } from "@angular/core";
import { MenuFlyoutItemBase } from "./MenuFlyoutItemBase";


//<div class="container"><div class="separator"></div></div><div class="container"><div class="separator"></div></div><div class="container"><div class="separator"></div></div>
@Component({
  selector: 'MenuFlyoutSeparator',
  template: `<div class="separator"></div>`,
  styleUrl: 'MenuFlyoutSeparator.scss'
})
export class MenuFlyoutSeparator extends MenuFlyoutItemBase {

}