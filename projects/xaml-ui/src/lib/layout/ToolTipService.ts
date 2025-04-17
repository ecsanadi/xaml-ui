import { Directive, HostBinding, Input, NgModule } from "@angular/core";

@Directive ({
  selector: '[ToolTipService-ToolTip]',
  standalone: false
})
export class ToolTipDirective {
  @Input('ToolTipService-ToolTip') @HostBinding('attr.title') ToolTip?: string; //For now we just use the title
}

@NgModule({
  declarations: [ToolTipDirective],
  exports: [ToolTipDirective]
})
export class ToolTipServiceModule { }