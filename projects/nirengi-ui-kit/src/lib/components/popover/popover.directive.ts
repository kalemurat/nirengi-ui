import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  effect,
  ComponentRef,
  Type,
  output,
  Injector,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  Overlay,
  OverlayRef,
  OverlayPositionBuilder,
  ConnectionPositionPair,
  PositionStrategy,
  OverlayConfig,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { PopoverComponent } from './popover.component';
import { PopoverPosition } from './popover.types';
import { PopoverRef } from './popover.ref';

/**
 * Directive that opens a popover next to the element when clicked.
 *
 * ## Usage
 *
 * ### 1. Basic Usage
 * ```html
 * <button [nirengiPopover]="MyContentComponent">Open</button>
 * ```
 *
 * ### 2. Setting Position
 * ```html
 * <button
 *   [nirengiPopover]="MyContentComponent"
 *   [nirengiPopoverPosition]="PopoverPosition.Right">
 *   Open on Right
 * </button>
 * ```
 *
 * ### 3. Passing Inputs
 * Use `nirengiPopoverInputs` to send data to the rendered component.
 * ```html
 * <button
 *   [nirengiPopover]="MyContentComponent"
 *   [nirengiPopoverInputs]="{ user: currentUser, title: 'Profile' }">
 *   Profile Detail
 * </button>
 * ```
 * You can receive this data with the `input()` signal in the component:
 * ```typescript
 * export class MyContentComponent {
 *   readonly user = input<User>();
 *   readonly title = input<string>();
 * }
 * ```
 *
 * ### 4. Listening to Outputs (Event Handling)
 * Use `nirengiPopoverOutput` to listen to events from the rendered component.
 * You can send events using the `PopoverRef.emit()` method inside the component.
 * ```html
 * <button
 *   [nirengiPopover]="MyContentComponent"
 *   (nirengiPopoverOutput)="handlePopoverEvent($event)">
 *   Take Action
 * </button>
 * ```
 * ```typescript
 * // Parent Component
 * handlePopoverEvent(event: { key: string, data: unknown }) {
 *   if (event.key === 'save' && typeof event.data === 'object') {
 *     // Handle event
 *   }
 * }
 *
 * // Content Component (Inside Popover)
 * export class MyContentComponent {
 *   private popoverRef = inject(PopoverRef);
 *
 *   save() {
 *     this.popoverRef.emit('save', { id: 123 });
 *   }
 * }
 * ```
 *
 * ### 5. Closing from Inside the Component
 * You can close the popover by injecting the `PopoverRef` service.
 * ```typescript
 * export class MyContentComponent {
 *   private popoverRef = inject(PopoverRef);
 *
 *   close() {
 *     this.popoverRef.close(); // Can optionally return a result
 *   }
 * }
 * ```
 *
 * ### 6. Preventing Closure on Outside Click
 * ```html
 * <button
 *   [nirengiPopover]="MyContentComponent"
 *   [nirengiPopoverCloseOnOutsideClick]="false">
 *   Persistent Popover
 * </button>
 * ```
 */
@Directive({
  selector: '[nirengiPopover]',
  standalone: true,
})
export class PopoverDirective implements OnDestroy {
  /**
   * Component to be displayed inside the popover.
   */
  readonly nirengiPopover = input.required<Type<any>>();

  /**
   * Popover position.
   * Default: Bottom
   */
  readonly nirengiPopoverPosition = input<PopoverPosition>(PopoverPosition.Bottom);

  /**
   * Determines whether the popover closes when clicked outside.
   * Default: true
   */
  readonly nirengiPopoverCloseOnOutsideClick = input<boolean>(true);

  /**
   * Inputs to be passed to the popover content component.
   */
  readonly nirengiPopoverInputs = input<Record<string, unknown>>({});

  /**
   * Triggered when the popover is opened
   */
  readonly popoverOpened = output<void>();

  /**
   * Triggered when the popover is closed
   */
  readonly popoverClosed = output<void>();

  /**
   * Forwards events from the popover content to the outside.
   * Triggered when `PopoverRef.emit('key', data)` is used inside the component.
   */
  /**
   * Forwards events from the popover content to the outside.
   * Triggered when `PopoverRef.emit('key', data)` is used inside the component.
   */
  readonly nirengiPopoverOutput = output<{ key: string; data: unknown }>();

  private overlayRef: OverlayRef | null = null;
  private popoverRef: ComponentRef<PopoverComponent> | null = null;
  private isVisible = false;
  private backdropSubscription: Subscription | null = null;

  private readonly overlay = inject(Overlay);
  private readonly positionBuilder = inject(OverlayPositionBuilder);
  private readonly elementRef = inject(ElementRef);
  private readonly injector = inject(Injector);

  constructor() {
    // Listen to input changes
    effect(() => {
      if (this.popoverRef) {
        this.popoverRef.setInput('content', this.nirengiPopover());
        this.popoverRef.setInput('position', this.nirengiPopoverPosition());
        this.popoverRef.setInput('componentInputs', this.nirengiPopoverInputs());

        // Force change detection on the popover wrapper
        this.popoverRef.changeDetectorRef.detectChanges();
      }
    });
  }

  @HostListener('click')
  toggle(): void {
    if (this.isVisible) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.isVisible) return;

    const positionStrategy = this.getPositionStrategy();
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    const closeOnOutside = this.nirengiPopoverCloseOnOutsideClick();

    const overlayConfig = new OverlayConfig({
      positionStrategy,
      scrollStrategy,
      // If closing on outside click is desired, there should be a backdrop
      // If not, we don't listen to backdrop click, but a transparent backdrop might still be useful for overlay interaction
      // However, when the user sets 'false', they usually want to be able to "click elsewhere".
      // Therefore, we only set hasBackdrop if closeOnOutside is true.
      hasBackdrop: closeOnOutside,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    this.overlayRef = this.overlay.create(overlayConfig);

    // Close with backdrop click
    if (closeOnOutside) {
      this.backdropSubscription = this.overlayRef.backdropClick().subscribe(() => {
        this.close();
      });
    }

    const popoverRef = new PopoverRef(this.overlayRef);

    // Create a custom injector to inject PopoverRef
    const customInjector = Injector.create({
      providers: [{ provide: PopoverRef, useValue: popoverRef }],
      parent: this.injector,
    });

    // Listen to the close request via PopoverRef
    // (When the rendered component calls popoverRef.close())
    popoverRef.afterClosed().subscribe(() => {
      // Overlay already disposed, just clean up local state
      this.destroyPopover();
    });

    // Listen to events from PopoverRef and forward them
    popoverRef.events$.subscribe((event) => {
      this.nirengiPopoverOutput.emit(event);
    });

    const popoverPortal = new ComponentPortal(PopoverComponent);
    this.popoverRef = this.overlayRef.attach(popoverPortal);

    this.popoverRef.setInput('content', this.nirengiPopover());
    this.popoverRef.setInput('position', this.nirengiPopoverPosition());
    this.popoverRef.setInput('componentInputs', this.nirengiPopoverInputs());
    this.popoverRef.setInput('injector', customInjector);

    // For animation
    requestAnimationFrame(() => {
      if (this.popoverRef) {
        this.popoverRef.setInput('visible', true);
      }
    });

    this.isVisible = true;
    this.popoverOpened.emit();
  }

  /**
   * Closes the popover.
   * Works only if the popover is currently visible.
   */
  close(): void {
    if (!this.isVisible) return;

    if (this.popoverRef) {
      this.popoverRef.setInput('visible', false);

      setTimeout(() => {
        this.destroyPopover();
      }, 200);
    }
  }

  private destroyPopover(): void {
    if (this.overlayRef) {
      // Clean up subscription first
      if (this.backdropSubscription) {
        this.backdropSubscription.unsubscribe();
        this.backdropSubscription = null;
      }

      // If close was called externally and ref still exists
      if (this.overlayRef.hasAttached()) {
        this.overlayRef.detach();
        this.overlayRef.dispose();
      }
      this.overlayRef = null;
    }
    this.popoverRef = null;

    // Only emit if currently visible (to prevent repetition)
    if (this.isVisible) {
      this.isVisible = false;
      this.popoverClosed.emit();
    }
  }

  ngOnDestroy(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  private getPositionStrategy(): PositionStrategy {
    const position = this.nirengiPopoverPosition();
    const positions: ConnectionPositionPair[] = this.getPositions(position);

    return this.positionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions(positions)
      .withPush(true);
  }

  private getPositions(position: PopoverPosition): ConnectionPositionPair[] {
    // Offset (gap) between trigger and popover
    const offset = 8;

    switch (position) {
      case PopoverPosition.Top:
        return [
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: -offset,
          },
        ];
      case PopoverPosition.TopStart:
        return [
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetY: -offset,
          },
        ];
      case PopoverPosition.TopEnd:
        return [
          { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -offset },
        ];

      case PopoverPosition.Bottom:
        return [
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
            offsetY: offset,
          },
        ];
      case PopoverPosition.BottomStart:
        return [
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: offset,
          },
        ];
      case PopoverPosition.BottomEnd:
        return [
          { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: offset },
        ];

      case PopoverPosition.Left:
        return [
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
            offsetX: -offset,
          },
        ];
      case PopoverPosition.LeftStart:
        return [
          { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -offset },
        ];
      case PopoverPosition.LeftEnd:
        return [
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'bottom',
            offsetX: -offset,
          },
        ];

      case PopoverPosition.Right:
        return [
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
            offsetX: offset,
          },
        ];
      case PopoverPosition.RightStart:
        return [
          { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: offset },
        ];
      case PopoverPosition.RightEnd:
        return [
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetX: offset,
          },
        ];

      default:
        return [
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
            offsetY: offset,
          },
        ];
    }
  }
}
