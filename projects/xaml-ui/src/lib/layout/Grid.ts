import { Component, Directive, HostBinding, Input, NgModule } from "@angular/core";
import { Orientation } from "../Common";
import { PanelComponent } from "./Panel";

@Component({
  selector: 'Grid',
  template: `<ng-content/>`,
  styles: `:host { 
    display: grid;
    position: relative;
  }`,
  standalone: false
})
export class GridComponent extends PanelComponent {
  @Input() @HostBinding('style.grid-template-columns') ColumnDefinitions?: string;
  @Input() @HostBinding('style.grid-template-rows') RowDefinitions?: string;
  @Input() @HostBinding('style.grid-auto-columns') AutoColumnDefinition?: string;
  @Input() @HostBinding('style.grid-auto-rows') AutoRowDefinition?: string;
  @Input() @HostBinding('style.column-gap') ColumnSpacing?: string;
  @Input() @HostBinding('style.row-gap') RowSpacing?: string;
  @Input() Orientation: Orientation = 'Horizontal';

  @HostBinding('style.grid-auto-flow')
  private get gridAutoFlow() {
    return this.Orientation === 'Horizontal' ? 'column' : 'row';
  }
}

export class GridProperty {
  Column?: number;
  Row?: number;
  ColumnSpan?: number;
  RowSpan?: number;
}

@Directive ({
  selector: '[Grid]',
  standalone: false
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

@Directive ({
  selector: '[Grid-Row]',
  standalone: false
})
export class GridRowDirective {
  @Input('Grid-Row') Row?: string;

  @HostBinding('style.grid-row-start')
  private get gridRowStart() {
    return this.Row !== undefined ? parseInt(this.Row) + 1 : undefined;
  }
}

@Directive ({
  selector: '[Grid-Column]',
  standalone: false
})
export class GridColumnDirective {
  @Input('Grid-Column') Column?: string;

  @HostBinding('style.grid-column-start')
  private get gridColumnStart() {
    return this.Column !== undefined ? parseInt(this.Column) + 1 : undefined;
  }
}

@Directive({
  selector: '[Grid-RowSpan]',
  standalone: false
})
export class GridRowSpanDirective {
  @Input('Grid-RowSpan') RowSpan?: string;

  @HostBinding('style.grid-row-end')
  private get gridRowEnd() {
    return this.RowSpan !== undefined ? ('span ' + this.RowSpan) : undefined;
  }
}

@Directive({
  selector: '[Grid-ColumnSpan]',
  standalone: false
})
export class GridColumnSpanDirective {
  @Input('Grid-ColumnSpan') ColumnSpan?: string;

  @HostBinding('style.grid-column-end')
  private get gridColumnEnd() {
    return this.ColumnSpan !== undefined ? ('span ' + this.ColumnSpan) : undefined;
  }
}

const GridComponents : any[] = [
  GridComponent,
  GridDirective,
  GridRowDirective,
  GridRowSpanDirective,
  GridColumnDirective,
  GridColumnSpanDirective
]

@NgModule({
  declarations: GridComponents,
  exports: GridComponents
})
export class GridModule { }