import { Component, input, Type, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverDirective } from '../popover/popover.directive';
import { PopoverPosition } from '../popover/popover.types';
import { PopoverRef } from '../popover/popover.ref';
import { ButtonComponent } from '../button/button.component';
import { HeadingComponent, HeadingLevel } from '../heading/heading.component';
import { ParagraphComponent } from '../paragraph/paragraph.component';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';
import { ButtonType } from '../button/button.component';

/**
 * Example content to be displayed within the popover.
 */
@Component({
  selector: 'nirengi-popover-example-content',
  standalone: true,
  imports: [CommonModule, HeadingComponent, ParagraphComponent, ButtonComponent],
  template: `
    <div class="w-64">
      <nui-heading [level]="HeadingLevel.H4" class="mb-2">
        {{ title() || 'Default Title' }}
      </nui-heading>
      <nui-paragraph class="mb-4 text-sm text-slate-600 dark:text-slate-300">
        This component was rendered dynamically.
        <br />
        <strong>Input Received:</strong> {{ customData() }}
      </nui-paragraph>
      <div class="flex justify-end gap-2">
        <nui-button
          [size]="Size.XSmall"
          [variant]="ColorVariant.Neutral"
          [kind]="ButtonType.Ghost"
          (clicked)="onAction('cancel')"
        >
          Cancel
        </nui-button>
        <nui-button
          [size]="Size.XSmall"
          [variant]="ColorVariant.Primary"
          (clicked)="onAction('confirm')"
        >
          Confirm
        </nui-button>
      </div>
    </div>
  `,
})
export class PopoverExampleContentComponent {
  /**
   * Input example from the parent
   */
  readonly title = input<string>();

  /**
   * Another input example from the parent
   */
  readonly customData = input<string>();

  protected readonly HeadingLevel = HeadingLevel;
  protected readonly Size = Size;
  protected readonly ColorVariant = ColorVariant;
  protected readonly ButtonType = ButtonType;

  // PopoverRef should be injected optionally because the component can also be used outside the popover (theoretically)
  private readonly popoverRef = inject(PopoverRef, { optional: true });

  /**
   * Handles action from the example content component.
   * Emits an event through the popover reference and closes the popover if applicable.
   *
   * @param action The action type: 'cancel' or 'confirm'
   */
  onAction(action: 'cancel' | 'confirm'): void {
    if (this.popoverRef) {
      if (action === 'confirm') {
        this.popoverRef.emit('action', { type: 'success', message: 'Great!' });
        this.popoverRef.close();
      } else {
        this.popoverRef.close();
      }
    } else {
      console.warn('PopoverRef not found');
    }
  }
}

/**
 * Demo wrapper component for the Popover showcase.
 */
@Component({
  selector: 'nirengi-popover-demo',
  standalone: true,
  imports: [CommonModule, PopoverDirective, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 dark:border-slate-700 dark:bg-slate-900"
    >
      <nui-button
        [nirengiPopover]="contentComponent"
        [nirengiPopoverPosition]="position()"
        [nirengiPopoverCloseOnOutsideClick]="closeOnOutsideClick()"
        [nirengiPopoverInputs]="demoInputs"
        (nirengiPopoverOutput)="handleEvent($event)"
        [variant]="ColorVariant.Primary"
      >
        Open Popover
      </nui-button>

      @if (lastEvent) {
        <div
          class="animate-fade-in rounded border border-slate-200 bg-white p-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <span class="font-bold text-slate-700 dark:text-slate-300">Last Event:</span>
          <code class="ml-2 rounded bg-slate-100 p-1 text-xs dark:bg-slate-900">{{
            lastEvent | json
          }}</code>
        </div>
      }
    </div>
  `,
})
export class PopoverDemoComponent {
  /**
   * Position from the showcase
   */
  readonly position = input<PopoverPosition>(PopoverPosition.Bottom);

  /**
   * Outside click setting from the showcase
   */
  readonly closeOnOutsideClick = input<boolean>(true);

  /**
   * Content to be displayed
   */
  readonly contentComponent: Type<unknown> = PopoverExampleContentComponent;

  /**
   * Sample inputs to be passed to the component
   */
  readonly demoInputs = {
    title: 'Dynamic Title',
    customData: 'Data coming from the parent component.',
  };

  /**
   * The latest event emitted by the popover instance.
   */
  lastEvent: PopoverEventPayload | null = null;

  protected readonly ColorVariant = ColorVariant;

  /**
   * Handles popover events and displays them to the user.
   * Automatically clears the last event after 3 seconds.
   *
   * @param event The event object emitted by the popover component
   */
  handleEvent(event: PopoverEventPayload): void {
    this.lastEvent = event;

    // Clear the message after 3 seconds
    setTimeout(() => {
      this.lastEvent = null;
    }, 3000);
  }
}

/**
 * Payload shape used for popover event samples.
 */
interface PopoverEventPayload {
  key: string;
  data: unknown;
}
