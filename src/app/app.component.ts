import { Component } from '@angular/core';
import { Border } from "./controls/Border";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [Border]
})
export class AppComponent {
  title = 'xaml-ui';
}
