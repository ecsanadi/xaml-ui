import { AfterContentInit, AfterViewInit, Component, Input } from "@angular/core";
import { Popup3Component, PopupTemplate } from "../primitives/Popup3";
import { FlyoutPlacementMode } from "../Common";
import { FlyoutPresenter, FlyoutPresenterAnimation } from "../primitives/FlyoutPresenter";
import { ConnectedPosition } from "@angular/cdk/overlay";

@Component({
  selector: 'Flyout2',
  imports: [FlyoutPresenter],
  template: PopupTemplate,
  providers: [{ provide: 'xaml-flyout', useExisting: Flyout2Component }]
})
export class Flyout2Component extends Popup3Component {
  @Input() Placement: FlyoutPlacementMode = 'Top';

  protected override get transitionAnimation(): FlyoutPresenterAnimation {
    switch (this.Placement) {
      case "Top":
      case "TopEdgeAlignedLeft":
      case "TopEdgeAlignedRight":
        return 'SlideUp';

      case "Bottom":
      case "BottomEdgeAlignedLeft":
      case "BottomEdgeAlignedRight":
        return 'SlideDown';

      case "Left":
      case "LeftEdgeAlignedTop":
      case "LeftEdgeAlignedBottom":
        return 'SlideLeft';

      case "Right":
      case "RightEdgeAlignedTop":
      case "RightEdgeAlignedBottom":
        return 'SlideRight';
    }
  }

  protected override get positioning(): ConnectedPosition {

    switch (this.Placement) {
      case "Top":
        return {
          originX: 'center', originY: 'top',
          overlayX: 'center', overlayY: 'bottom'
        };
      case "TopEdgeAlignedLeft":
        return {
          originX: 'start', originY: 'top',
          overlayX: 'start', overlayY: 'bottom'
        };
      case "TopEdgeAlignedRight":
        return {
          originX: 'end', originY: 'top',
          overlayX: 'end', overlayY: 'bottom'
        };

      case "Bottom":
        return {
          originX: 'center', originY: 'bottom',
          overlayX: 'center', overlayY: 'top'
        };
      case "BottomEdgeAlignedLeft":
        return {
          originX: 'start', originY: 'bottom',
          overlayX: 'start', overlayY: 'top'
        };
      case "BottomEdgeAlignedRight":
        return {
          originX: 'end', originY: 'bottom',
          overlayX: 'end', overlayY: 'top'
        };

      case "Left":
        return {
          originX: 'start', originY: 'center',
          overlayX: 'end', overlayY: 'center'
        };
      case "LeftEdgeAlignedTop":
        return {
          originX: 'start', originY: 'top',
          overlayX: 'end', overlayY: 'top'
        };
      case "LeftEdgeAlignedBottom":
        return {
          originX: 'start', originY: 'bottom',
          overlayX: 'end', overlayY: 'bottom'
        };

      case "Right":
        return {
          originX: 'end', originY: 'center',
          overlayX: 'start', overlayY: 'center'
        };
      case "RightEdgeAlignedTop":
        return {
          originX: 'end', originY: 'top',
          overlayX: 'start', overlayY: 'top'
        };
      case "RightEdgeAlignedBottom":
        return {
          originX: 'end', originY: 'bottom',
          overlayX: 'start', overlayY: 'bottom'
        };
    }
  };
}