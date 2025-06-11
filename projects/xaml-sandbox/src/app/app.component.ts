import { Component } from '@angular/core';
import { RadioToggleButtonComponent, XamlRootComponent } from '../../../xaml-ui/src/public-api';
import { StackPanelComponent } from "../../../xaml-ui/src/lib/layout/StackPanel";
import { ButtonComponent } from "../../../xaml-ui/src/lib/basic-input/Button";
import { FlyoutComponent } from "../../../xaml-ui/src/lib/dialogs-and-flyouts/Flyout";
import { ScrollViewerComponent } from "../../../xaml-ui/src/lib/scrolling/ScrollViewer";
import { RadioButtonGroupComponent } from "../../../xaml-ui/src/lib/basic-input/RadioButton";
import { SliderComponent } from "../../../xaml-ui/src/lib/basic-input/Slider";
import { TextBoxComponent } from "../../../xaml-ui/src/lib/text/TextBox";
import { TextBlockComponent } from "../../../xaml-ui/src/lib/text/TextBlock";
import { ListViewComponent } from "../../../xaml-ui/src/lib/collections/ListView";
import { ComboBoxComponent } from "../../../xaml-ui/src/lib/basic-input/ComboBox";
import { MenuFlyoutComponent } from "../../../xaml-ui/src/lib/menus-and-toolbars/MenuFlyout";
import { MenuFlyoutItemComponent } from "../../../xaml-ui/src/lib/menus-and-toolbars/MenuFlyoutItem";
import { ContextFlyoutDirective, ItemFlyoutDirective } from '../../../xaml-ui/src/lib/dialogs-and-flyouts/ContextFlyout';
import { AppBarButtonComponent } from "../../../xaml-ui/src/lib/menus-and-toolbars/AppBarButton";
import { CommandBarComponent } from "../../../xaml-ui/src/lib/menus-and-toolbars/CommandBar";
import { NumberBoxComponent } from "../../../xaml-ui/src/lib/text/NumberBox";
import { RepeatButtonComponent } from "../../../xaml-ui/src/lib/basic-input/RepeatButton";
import { ColorPickerComponent } from "../../../xaml-ui/src/lib/basic-input/ColorPicker";
import { Color, colorToString } from '../../../xaml-ui/src/lib/Color';
import { GridModule } from "../../../xaml-ui/src/lib/layout/Grid";

@Component({
  selector: 'app-root',
  imports: [XamlRootComponent, StackPanelComponent, ButtonComponent, FlyoutComponent, ScrollViewerComponent, SliderComponent, TextBoxComponent, TextBlockComponent, ListViewComponent, ComboBoxComponent, MenuFlyoutComponent, MenuFlyoutItemComponent, ContextFlyoutDirective, AppBarButtonComponent, CommandBarComponent, NumberBoxComponent, RepeatButtonComponent, ColorPickerComponent, RadioButtonGroupComponent, FlyoutComponent, ContextFlyoutDirective, RadioToggleButtonComponent, GridModule, ItemFlyoutDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'xaml-sandbox';

  onValueChange(value: any) {
    console.log(value);
  }

  onClick() {
    console.log('click');
  }

  onColorSelected(value: Color) {
    console.log(colorToString(value));
  }
}
