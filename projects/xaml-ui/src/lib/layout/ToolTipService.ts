import { Directive, HostBinding, Input, NgModule } from "@angular/core";

@Directive ({
  selector: '[ToolTipService-ToolTip]',
  standalone: false
})
export class ToolTipProperty {
  @Input('ToolTipService-ToolTip') @HostBinding('attr.title') ToolTip?: string; //For now we just use the title
}

@NgModule({
  declarations: [ToolTipProperty],
  exports: [ToolTipProperty]
})
export class ToolTipService { }