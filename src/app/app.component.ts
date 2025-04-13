import { Component } from '@angular/core';
import { Border } from "./layout/Border";
import { StackPanel } from "./layout/StackPanel";
import { Grid, GridColumnProperty, GridColumnSpanProperty, GridDirective, GridRowProperty, GridRowSpanProperty } from './layout/Grid';
import { ScrollViewer } from './layout/ScrollViewer';
import { XamlRoot } from "./layout/XamlRoot";
import { TextBlock } from './indicators/TextBlock';
import { Button } from "./inputs/Button";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [Border, StackPanel, Grid, GridDirective, Button, ScrollViewer, XamlRoot, TextBlock, Button, GridColumnProperty, GridRowSpanProperty, GridColumnSpanProperty, GridRowProperty]
})
export class AppComponent {
  title = 'xaml-ui';
}
