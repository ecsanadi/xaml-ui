import { Component } from '@angular/core';
import { Border } from "./layout/Border";
import { StackPanel } from "./layout/StackPanel";
import { Grid, GridDirective } from './layout/Grid';
import { ScrollViewer } from './layout/ScrollViewer';
import { XamlRoot } from "./layout/XamlRoot";
import { TextBlock } from './indicators/TextBlock';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [Border, StackPanel, Grid, GridDirective, ScrollViewer, XamlRoot, TextBlock]
})
export class AppComponent {
  title = 'xaml-ui';
}
