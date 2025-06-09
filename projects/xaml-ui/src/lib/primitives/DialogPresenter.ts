import { Component, ContentChild, ElementRef, ViewChild } from "@angular/core";
import { XamlRootComponent } from "../XamlRoot";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'DialogPresenter',
  template: `<div #header class="header" [ngStyle]="{'display': isHeaderVisible ? 'grid' : 'none'}"><ng-content select="[Header]"/></div>
  <div class="body"><ng-content/></div>
  <div #footer class="footer" [ngStyle]="{'display': isFooterVisible ? 'grid' : 'none'}"><ng-content select="[Footer]"/></div>`,
  styleUrls: ['../XamlRoot.scss', 'DialogPresenter.scss'],
  imports: [CommonModule]
})
export class DialogPresenter extends XamlRootComponent {
  @ViewChild('header') private _header?: ElementRef<HTMLDivElement>;
  @ViewChild('footer') private _footer?: ElementRef<HTMLDivElement>;

  protected get isHeaderVisible() {
    return this._header?.nativeElement.children.length ?? 0 > 0;
  }

  protected get isFooterVisible() {
    return this._footer?.nativeElement.children.length ?? 0 > 0;
  }
}