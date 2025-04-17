import { Component, HostBinding, Input } from "@angular/core";
import { FlyoutPlacementMode } from "../layout/Common";

@Component({
  selector: 'Flyout',
  template: `<div class="content"><ng-content/></div>`,
  styleUrl: 'Flyout.scss'
})
export class Flyout {
  private static _nextId = 1;

  @Input() PlacementMode: FlyoutPlacementMode = 'Top';

  @HostBinding('attr.id')
  readonly Id = 'xaml-flyout-' + Flyout._nextId++;

  @HostBinding('attr.popover')
  private readonly _popover = '';

  @HostBinding('style')
  private get styles() {
    let anchor = `--${this.Id}-host`;
    let top: string | undefined;
    let left: string | undefined;
    let right: string | undefined;
    let bottom: string | undefined;
    let alignSelf: string | undefined;
    let justifySelf: string | undefined;
    let margin: string | undefined;

    switch (this.PlacementMode) {
      case 'Top':
      case 'TopEdgeAlignedLeft':
      case 'TopEdgeAlignedRight':
        bottom = `anchor(${anchor} top)`;
        left = `anchor(${anchor} left)`;
        right = `anchor(${anchor} right)`;
        alignSelf = 'flex-end';
        break;

      case 'Bottom':
      case 'BottomEdgeAlignedLeft':
      case 'BottomEdgeAlignedRight':
        top = `anchor(${anchor} bottom)`;
        left = `anchor(${anchor} left)`;
        right = `anchor(${anchor} right)`;
        alignSelf = 'flex-start';
        break;
      case 'Left':
      case 'LeftEdgeAlignedBottom':
      case 'LeftEdgeAlignedTop':
        right = `anchor(${anchor} left)`;
        top = `anchor(${anchor} top)`;
        bottom = `anchor(${anchor} bottom)`;
        justifySelf = 'right';
        break;
      case 'Right':
      case 'RightEdgeAlignedBottom':
      case 'RightEdgeAlignedTop':
        left = `anchor(${anchor} right)`;
        top = `anchor(${anchor} top)`;
        bottom = `anchor(${anchor} bottom)`;
        justifySelf = 'left';
        break;
    }

    switch (this.PlacementMode) {
      case 'Top':
      case 'Bottom':
        justifySelf = 'center';
        margin = '0 -100% 0 -100%';
        break;

      case 'TopEdgeAlignedLeft':
      case 'BottomEdgeAlignedLeft':
        justifySelf = 'left';
        margin = '0 -100% 0 0';
        break;

      case 'TopEdgeAlignedRight':
      case 'BottomEdgeAlignedRight':
        justifySelf = 'right';
        margin = '0 0 0 -100%';
        break;

      case 'Left':
      case 'Right':
        alignSelf = 'center';
        margin = '-100% 0 -100% 0';
        break;

      case 'LeftEdgeAlignedTop':
      case 'RightEdgeAlignedTop':
        alignSelf = 'flex-start';
        break;
      case 'LeftEdgeAlignedBottom':
      case 'RightEdgeAlignedBottom':
        alignSelf = 'flex-end';
        break;
    }

    return {
      'position-anchor': anchor,
      'top': top,
      'left': left,
      'right': right,
      'bottom': bottom,
      'align-self': alignSelf,
      'justify-self': justifySelf,
      'margin': margin
    };
  }

  @HostBinding('class')
  private get class() {
    switch (this.PlacementMode) {
      case 'Top':
      case 'TopEdgeAlignedLeft':
      case 'TopEdgeAlignedRight':
        return "roll-up";

      case 'Bottom':
      case 'BottomEdgeAlignedLeft':
      case 'BottomEdgeAlignedRight':
        return "roll-down";

      case 'Left':
      case 'LeftEdgeAlignedBottom':
      case 'LeftEdgeAlignedTop':
        return "roll-left";

      case 'Right':
      case 'RightEdgeAlignedBottom':
      case 'RightEdgeAlignedTop':
        return "roll-right";
    }
  }
}