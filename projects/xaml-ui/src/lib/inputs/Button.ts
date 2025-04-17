import { AfterContentInit, AfterViewInit, Component, ContentChildren, HostBinding, HostListener, Input, QueryList } from "@angular/core";
import { BorderComponent } from "../layout/Border";
import { Flyout } from "../overlays/Flyout";

@Component({
  selector: 'Button',
  template: `<ng-content/><ng-content select="flyout"/>`,
  styleUrl: 'Button.scss'
})
export class ButtonComponent extends BorderComponent implements AfterContentInit, AfterViewInit {
  @Input() IsEnabled: boolean = true;

  @HostBinding('attr.type')
  private readonly type = 'button';

  @HostBinding('attr.disabled')
  private get disabled() {
    return this.IsEnabled ? undefined : true;
  }

  @HostBinding('attr.popovertarget')
  private _popoverTarget?: string;

  private _popover: HTMLElement | null = null;

  @HostBinding('class.flyout-open')
  private _flyoutOpen = false;

  @ContentChildren(Flyout)
  private _children!: QueryList<Flyout>;

  ngAfterContentInit() {
    if (this._children.length === 0) return;

    this._popoverTarget = this._children.first.Id;
  }

  ngAfterViewInit(): void {
    this._popover = document.querySelector('#' + this._popoverTarget);    
  }

  @HostListener('pointerdown', ['$event'])
  @HostListener('pointerenter', ['$event'])
  @HostListener('pointerup', ['$event'])
  private onHostPointerEvent(event: Event) {
    this._flyoutOpen = this._popover?.matches(':popover-open') ?? false;
  }

  @HostBinding('style.anchor-name')
  private get anchorName() {
    return this._popoverTarget ? `--${this._popoverTarget}-host` : undefined;
  }
}