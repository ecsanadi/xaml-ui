import { Component } from '@angular/core';
import { Border } from "./layout/Border";
import { StackPanel } from "./layout/StackPanel";
import { Grid } from './layout/Grid';
import { ScrollViewer } from './layout/ScrollViewer';
import { XamlRoot } from "./layout/XamlRoot";
import { TextBlock } from './indicators/TextBlock';
import { Button } from "./inputs/Button";
import { CheckBox } from './inputs/CheckBox';
import { ToolTipService } from './layout/ToolTipService';
import { RadioButton, RadioButtonGroup } from './inputs/RadioButton';
import { ToggleButton } from "./inputs/ToggleButton";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [Border, StackPanel, Grid, Button, ScrollViewer, XamlRoot, TextBlock, Button, CheckBox, ToolTipService, RadioButton, RadioButtonGroup, ToggleButton]
})
export class AppComponent {
  title = 'xaml-ui';

  onRadioButtonChange(value: any) {
    console.log(value);
  }
}