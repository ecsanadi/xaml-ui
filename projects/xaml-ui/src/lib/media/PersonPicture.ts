import { Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FrameworkElementComponent } from "../FrameworkElement";
import { GridModule } from "../layout/Grid";
import { ImageComponent } from "./Image";
import { ToolTipServiceModule } from "../status-and-info/ToolTipService";
import { TextBlockComponent } from "../text/TextBlock";
import { BorderComponent } from "../layout/Border";
import { FontIconComponent } from "../icons/FontIcon";

@Component({
  selector: 'PersonPicture',
  templateUrl: 'PersonPicture.html',
  styles: `:host {
    container-type: inline-size;
    display: grid;
  }`,
  imports: [CommonModule, GridModule, ImageComponent, ToolTipServiceModule, TextBlockComponent, BorderComponent, FontIconComponent]
})
export class PersonPictureComponent extends FrameworkElementComponent {
  @Input() DisplayName?: string;
  @Input() ProfilePicture?: string;
  @Input() Initials?: string;

  @Input() BadgeText?: string;
  @Input() BadgeGlyph?: string;
  @Input() BadgeImageSource?: string;

  constructor() {
    super();

    this.Width = "96px";
    this.Height = "96px";
  }

  protected get fallbackInitials(): string {
    if (this.DisplayName) {
      return this.DisplayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }
    return '?';
  }
}