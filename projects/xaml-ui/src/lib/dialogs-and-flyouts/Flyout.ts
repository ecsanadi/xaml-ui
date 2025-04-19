import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FlyoutPlacementMode } from "../Common";
import { CommonModule } from "@angular/common";
import { PopupComponent } from "../primitives/Popup";

@Component({
  selector: 'Flyout',
  imports: [CommonModule],
  template: `<div class="popup-backdrop" (click)="onBackdropClick($event)" *ngIf="IsOpen"></div>
    <div class="popup-container" [ngStyle]="containerStyle" [ngClass]="containerClass">
      <div class="popup-content" [ngStyle]="contentStyle"><ng-content/></div>
    </div>`,
  styleUrl: '../primitives/Popup.scss'
})
export class FlyoutComponent extends PopupComponent {
  @Input() PlacementMode: FlyoutPlacementMode = 'Top';

  get contentStyle() {
    let alignSelf: string | undefined;
    let justifySelf: string | undefined;

    switch (this.PlacementMode) {
      case 'Top':
      case 'Bottom':
        justifySelf = 'center';
        break;

      case 'TopEdgeAlignedLeft':
      case 'BottomEdgeAlignedLeft':
        justifySelf = 'left';
        break;

      case 'TopEdgeAlignedRight':
      case 'BottomEdgeAlignedRight':
        justifySelf = 'right';
        break;

      case 'Left':
      case 'Right':
        alignSelf = 'center';
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
      'align-self': alignSelf,
      'justify-self': justifySelf,
    };
  }

  get containerStyle() {
    let top: string | undefined = '0';
    let left: string | undefined = '0';
    let right: string | undefined = '0';
    let bottom: string | undefined = '0';
    let transform: string | undefined;

    function translate(x: number, y: number, isOpen: boolean) {
      let result = '';
      if (x !== 0) {
        result += `translateX(${x > 0 ? '' : '-'}100%)`
        if (!isOpen) { result += `translateX(${x > 0 ? '-' : ''}10px)`; }
      }

      if (y !== 0) {
        result += `translateY(${y > 0 ? '' : '-'}100%)`;
        if (!isOpen) { result += `translateY(${y > 0 ? '-' : ''}10px)`; }
      }

      return result;
    }

    switch (this.PlacementMode) {
      case 'Top':
      case 'TopEdgeAlignedLeft':
      case 'TopEdgeAlignedRight':
        bottom = undefined;
        transform = translate(0, -1, this.IsOpen);
        break;

      case 'Bottom':
      case 'BottomEdgeAlignedLeft':
      case 'BottomEdgeAlignedRight':
        top = undefined;
        transform = translate(0, 1, this.IsOpen);
        break;

      case 'Left':
      case 'LeftEdgeAlignedBottom':
      case 'LeftEdgeAlignedTop':
        right = undefined;
        transform = translate(-1, 0, this.IsOpen);
        break;

      case 'Right':
      case 'RightEdgeAlignedBottom':
      case 'RightEdgeAlignedTop':
        left = undefined;
        transform = translate(1, 0, this.IsOpen);
        break;
    }

    let margin: string | undefined;

    switch (this.PlacementMode) {
      case 'Top':
        margin = '0 -100vw -100vh -100vw';
        break;

      case 'TopEdgeAlignedLeft':
        margin = '0 -100vw -100vh 0';
        break;

      case 'TopEdgeAlignedRight':
        margin = '0 0 -100vh -100vw';
        break;

      case 'Bottom':
        margin = '-100vh -100vw 0 -100vw';
        break;

      case 'BottomEdgeAlignedLeft':
        margin = '0 -100vw 0 0';
        break;

      case 'BottomEdgeAlignedRight':
        margin = '0 0 0 -100vw';
        break;

      case 'Left':
        margin = '-100vh -100vw -100vh 0';
        break;

      case 'LeftEdgeAlignedTop':
        margin = '0 -100vw -100vh 0';
        break;

      case 'LeftEdgeAlignedBottom':
        margin = '-100vh -100vw 0 0';
        break;

      case 'Right':
        margin = '-100vh 0 -100vh -100vw';
        break;

      case 'RightEdgeAlignedTop':
        margin = '0 0 -100vh -100vw';
        break;

      case 'RightEdgeAlignedBottom':
        margin = '-100vh 0 0 -100vw';
        break;
    }

    return {
      'top': top,
      'left': left,
      'right': right,
      'bottom': bottom,
      'transform': transform,
      'margin': margin,
      'transition': 'transform var(--ControlNormalAnimationDuration)'
    };
  }
}