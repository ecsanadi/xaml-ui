import { Component, Directive, HostBinding, Input } from "@angular/core";
import { Border } from "./Border";
import { CommonModule } from "@angular/common";
import { Orientation } from "./Common";

@Component({
  selector: 'Grid',
  imports: [CommonModule],
  template: `<ng-container><ng-content/></ng-container>`,
  styles: `:host { 
    display: grid;
  }`
})
export class Grid extends Border {
  @Input() @HostBinding('style.grid-template-columns') ColumnDefinitions?: string;
  @Input() @HostBinding('style.grid-template-rows') RowDefinitions?: string;
  @Input() @HostBinding('style.column-gap') ColumnSpacing?: string;
  @Input() @HostBinding('style.row-gap') RowSpacing?: string;
  @Input() Orientation: Orientation = 'Horizontal';

  @HostBinding('style.grid-auto-flow')
  private get gridAutoFlow() {
    return this.Orientation == 'Horizontal' ? 'row' : 'column';
  }
}

export class GridProperty {
  Column?: number;
  Row?: number;
  ColumnSpan?: number;
  RowSpan?: number;
}

@Directive ({
  selector: '[Grid]'  
})
export class GridDirective {
  @Input() Grid: GridProperty = new GridProperty();

  @HostBinding('style.grid-column-start')
  private get gridColumnStart() {
    return this.Grid.Column !== undefined ? this.Grid.Column + 1 : undefined;
  }

  @HostBinding('style.grid-row-start')
  private get gridRowStart() {
    return this.Grid.Row !== undefined ? this.Grid.Row + 1 : undefined;
  }

  @HostBinding('style.grid-column-end')
  private get gridColumnEnd() {
    return this.Grid.ColumnSpan !== undefined ? ('span ' + this.Grid.ColumnSpan) : undefined;
  }

  @HostBinding('style.grid-row-end')
  private get gridRowEnd() {
    return this.Grid.RowSpan !== undefined ? ('span ' + this.Grid.RowSpan) : undefined;
  }
}