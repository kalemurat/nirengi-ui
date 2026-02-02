import {
    Directive,
    ElementRef,
    HostListener,
    inject,
    input,
    OnDestroy,
    effect,
    ComponentRef,
} from '@angular/core';
import {
    Overlay,
    OverlayRef,
    OverlayPositionBuilder,
    ConnectionPositionPair,
    PositionStrategy,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TooltipComponent } from './tooltip.component';
import { TooltipPosition } from './tooltip.types';

/**
 * Directive that shows a tooltip when the element is hovered over.
 * Uses Angular CDK Overlay for positioning.
 *
 * @example
 * <button [nirengiTooltip]="'Confirm action'" [nirengiTooltipPosition]="TooltipPosition.Top">Confirm</button>
 */
@Directive({
  selector: '[nirengiTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  /**
   * Tooltip text.
   */
  readonly nirengiTooltip = input.required<string>();

  /**
   * Tooltip position.
   * Default: Top
   */
  readonly nirengiTooltipPosition = input<TooltipPosition>(TooltipPosition.Top);

  private overlayRef: OverlayRef | null = null;
  private tooltipRef: ComponentRef<TooltipComponent> | null = null;

  private readonly overlay = inject(Overlay);
  private readonly positionBuilder = inject(OverlayPositionBuilder);
  private readonly elementRef = inject(ElementRef);

  constructor() {
    // Listen to input changes and update
    effect(() => {
      if (this.tooltipRef) {
        this.tooltipRef.setInput('text', this.nirengiTooltip());
        this.tooltipRef.setInput('position', this.nirengiTooltipPosition());
        // If position changes, position strategy might need updating but show/hide is enough for now
      }
    });
  }

  /**
   * Executed when the mouse enters the element.
   */
  @HostListener('mouseenter')
  show(): void {
    if (this.overlayRef) {
      // Don't show if already exists (or close and open)
      return;
    }

    const positionStrategy = this.getPositionStrategy();
    this.overlayRef = this.overlay.create({ positionStrategy });

    // Create the component and attach to overlay
    const tooltipPortal = new ComponentPortal(TooltipComponent);
    this.tooltipRef = this.overlayRef.attach(tooltipPortal);

    // Set component inputs
    this.tooltipRef.setInput('text', this.nirengiTooltip());
    this.tooltipRef.setInput('position', this.nirengiTooltipPosition());

    // Make visible (for animation)
    // Leave for the next tick with requestAnimationFrame to ensure the transition works
    requestAnimationFrame(() => {
      if (this.tooltipRef) {
        this.tooltipRef.setInput('visible', true);
      }
    });
  }

  /**
   * Executed when the mouse leaves the element.
   */
  @HostListener('mouseleave')
  hide(): void {
    if (this.tooltipRef) {
      this.tooltipRef.setInput('visible', false);
      // Wait for animation to finish and then destroy
      setTimeout(() => {
        if (this.overlayRef) {
          this.overlayRef.detach();
          this.overlayRef.dispose();
          this.overlayRef = null;
          this.tooltipRef = null;
        }
      }, 200); // 200ms transition time should be consistent with CSS
    }
  }

  ngOnDestroy(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  /**
   * Creates the position strategy.
   */
  private getPositionStrategy(): PositionStrategy {
    const position = this.nirengiTooltipPosition();
    const positions: ConnectionPositionPair[] = [];

    // Create overlay positions
    // Simple approach, for more advanced use ConnectedPosition
    switch (position) {
      case TooltipPosition.Top:
        positions.push({
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: -8, // Gap between
        });
        break;
      case TooltipPosition.Bottom:
        positions.push({
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetY: 8,
        });
        break;
      case TooltipPosition.Left:
        positions.push({
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'center',
          offsetX: -8,
        });
        break;
      case TooltipPosition.Right:
        positions.push({
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: 8,
        });
        break;
    }

    // Create position strategy
    return this.positionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions(positions)
      .withPush(false); // Can be set to true to prevent overflow off-screen
  }
}
