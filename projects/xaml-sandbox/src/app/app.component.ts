import { Component } from '@angular/core';
import { XamlRootComponent } from '../../../xaml-ui/src/public-api';
import { StackPanelComponent } from "../../../xaml-ui/src/lib/layout/StackPanel";
import { ButtonComponent } from "../../../xaml-ui/src/lib/basic-input/Button";
import { FlyoutComponent } from "../../../xaml-ui/src/lib/dialogs-and-flyouts/Flyout";
import { ListBoxComponent } from "../../../xaml-ui/src/lib/collections/ListBox";
import { ScrollViewerComponent } from "../../../xaml-ui/src/lib/scrolling/ScrollViewer";
import { ScrollBarComponent } from "../../../xaml-ui/src/lib/scrolling/ScrollBar";
import { CheckBoxComponent } from "../../../xaml-ui/src/lib/basic-input/CheckBox";
import { RadioButtonComponent, RadioButtonGroup } from "../../../xaml-ui/src/lib/basic-input/RadioButton";
import { SliderComponent } from "../../../xaml-ui/src/lib/basic-input/Slider";
import { ToggleSwitchComponent } from "../../../xaml-ui/src/lib/basic-input/ToggleSwitch";
import { TextBoxComponent } from "../../../xaml-ui/src/lib/text/TextBox";
import { TextBlockComponent } from "../../../xaml-ui/src/lib/text/TextBlock";
import { ListViewComponent } from "../../../xaml-ui/src/lib/collections/ListView";
import { ComboBoxComponent } from "../../../xaml-ui/src/lib/basic-input/ComboBox";
import { DropDownButtonComponent } from "../../../xaml-ui/src/lib/basic-input/DropDownButton";
import { MenuFlyoutComponent } from "../../../xaml-ui/src/lib/menus-and-toolbars/MenuFlyout";
import { MenuFlyoutItemComponent } from "../../../xaml-ui/src/lib/menus-and-toolbars/MenuFlyoutItem";
import { MenuFlyoutSeparator } from "../../../xaml-ui/src/lib/menus-and-toolbars/MenuFlyoutSeparator";
import { ContextFlyoutDirective } from '../../../xaml-ui/src/lib/dialogs-and-flyouts/ContextFlyout';
import { ToggleButtonComponent } from "../../../xaml-ui/src/lib/basic-input/ToggleButton";
import { SplitButtonComponent } from "../../../xaml-ui/src/lib/basic-input/SplitButton";
import { ImageComponent } from "../../../xaml-ui/src/lib/media/Image";
import { AppBarButtonComponent } from "../../../xaml-ui/src/lib/menus-and-toolbars/AppBarButton";
import { CommandBarComponent } from "../../../xaml-ui/src/lib/menus-and-toolbars/CommandBar";
import { NumberBoxComponent } from "../../../xaml-ui/src/lib/text/NumberBox";
import { RepeatButtonComponent } from "../../../xaml-ui/src/lib/basic-input/RepeatButton";
import { ColorPickerComponent } from "../../../xaml-ui/src/lib/basic-input/ColorPicker";
import { Color, colorToString } from '../../../xaml-ui/src/lib/Color';
import { Popup2 } from "../../../xaml-ui/src/lib/primitives/Popup2";
import { Flyout2Component } from '../../../xaml-ui/src/lib/dialogs-and-flyouts/Flyout2';

@Component({
  selector: 'app-root',
  imports: [XamlRootComponent, StackPanelComponent, ButtonComponent, FlyoutComponent, ListBoxComponent, ScrollViewerComponent, ScrollBarComponent, CheckBoxComponent, RadioButtonComponent, SliderComponent, ToggleSwitchComponent, TextBoxComponent, TextBlockComponent, ListViewComponent, ComboBoxComponent, DropDownButtonComponent, MenuFlyoutComponent, MenuFlyoutItemComponent, MenuFlyoutSeparator, ContextFlyoutDirective, ToggleButtonComponent, SplitButtonComponent, ImageComponent, AppBarButtonComponent, CommandBarComponent, NumberBoxComponent, RepeatButtonComponent, ColorPickerComponent, RadioButtonGroup, Popup2, Flyout2Component, ContextFlyoutDirective],
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
