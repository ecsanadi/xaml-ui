import { Component } from '@angular/core';
import { XamlRootComponent } from '../../../xaml-ui/src/public-api';
import { StackPanelComponent } from "../../../xaml-ui/src/lib/layout/StackPanel";
import { ButtonComponent } from "../../../xaml-ui/src/lib/basic-input/Button";
import { Flyout } from "../../../xaml-ui/src/lib/dialogs-and-flyouts/Flyout";

@Component({
  selector: 'app-root',
  imports: [XamlRootComponent, StackPanelComponent, ButtonComponent, Flyout],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'xaml-sandbox';
}
