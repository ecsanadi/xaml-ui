import { Component, HostBinding, Input } from "@angular/core";
import { FrameworkElementComponent } from "../FrameworkElement";
import { FontStyle, FontWeights } from "../Common";
import { TextBlockComponent } from "../text/TextBlock";

@Component({
  selector: 'FontIcon',
  template: `{{Glyph}}`,
  styles: `:host {
    font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
  }`
})
export class FontIconComponent extends FrameworkElementComponent {
  @Input() @HostBinding('style.font-family') FontFamily?: string;
  @Input() @HostBinding('style.font-size') FontSize?: string;
  @Input() @HostBinding('style.font-style') FontStyle?: FontStyle;  
  @Input() FontWeight: FontWeights = 'Normal';
  @Input() Glyph?: string;
  
  @HostBinding('style.font-weight')
  private get fontWeight() {
    return TextBlockComponent.ToFontWeight(this.FontWeight);
  }
}