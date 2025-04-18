import { Component } from '@angular/core';
import { XamlRootComponent } from '../../../xaml-ui/src/public-api';
import { StackPanelComponent } from "../../../xaml-ui/src/lib/layout/StackPanel";
import { ButtonComponent } from "../../../xaml-ui/src/lib/basic-input/Button";
import { Flyout } from "../../../xaml-ui/src/lib/dialogs-and-flyouts/Flyout";
import { ListBoxComponent } from "../../../xaml-ui/src/lib/collections/ListBox";
import { ScrollViewerComponent } from "../../../xaml-ui/src/lib/scrolling/ScrollViewer";
import { ScrollBar } from "../../../xaml-ui/src/lib/scrolling/ScrollBar";
import { CheckBoxComponent } from "../../../xaml-ui/src/lib/basic-input/CheckBox";
import { RadioButtonComponent } from "../../../xaml-ui/src/lib/basic-input/RadioButton";
import { SliderComponent } from "../../../xaml-ui/src/lib/basic-input/Slider";
import { ToggleSwitchComponent } from "../../../xaml-ui/src/lib/basic-input/ToggleSwitch";
import { TextBoxComponent } from "../../../xaml-ui/src/lib/text/TextBox";

@Component({
  selector: 'app-root',
  imports: [XamlRootComponent, StackPanelComponent, ButtonComponent, Flyout, ListBoxComponent, ScrollViewerComponent, ScrollBar, CheckBoxComponent, RadioButtonComponent, SliderComponent, ToggleSwitchComponent, TextBoxComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'xaml-sandbox';
}
