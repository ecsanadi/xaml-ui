import { Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FrameworkElementComponent } from "../FrameworkElement";

@Component({
  selector: 'PersonPicture',
  template: `<div class="avatar">
    <img *ngIf="ProfilePicture; else initialsTemplate"
         [src]="ProfilePicture" alt="{{ DisplayName || Initials }}" />
    <ng-template #initialsTemplate>
      <span class="initials">{{ Initials || fallbackInitials }}</span>
    </ng-template>
  </div>
  <div *ngIf="BadgeText || BadgeGlyph || BadgeImageSource" class="badge">
    <img *ngIf="BadgeImageSource" [src]="BadgeImageSource" />
    <span *ngIf="BadgeText">{{ BadgeText }}</span>
    <span *ngIf="BadgeGlyph" class="glyph">{{ BadgeGlyph }}</span>
  </div>`,
  styleUrl: 'PersonPicture.scss',
  imports: [CommonModule]
})
export class PersonPictureComponent extends FrameworkElementComponent {
  @Input() DisplayName?: string;
  @Input() ProfilePicture?: string;
  @Input() Initials?: string;
  
  @Input() BadgeText?: string;
  @Input() BadgeGlyph?: string;
  @Input() BadgeImageSource?: string;

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