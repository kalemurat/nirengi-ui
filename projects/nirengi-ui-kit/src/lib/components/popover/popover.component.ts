import { Component, ChangeDetectionStrategy, input, Type, computed, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverPosition } from './popover.types';

@Component({
  selector: 'nirengi-popover',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses()">
      <div class="popover__content">
        <ng-container
          *ngComponentOutlet="content(); injector: injector(); inputs: componentInputs()"
        ></ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .popover {
        /* Base popover style */
        @apply z-50 min-w-[200px] scale-95 rounded-lg border border-default bg-primary p-4 opacity-0 shadow-xl transition-all duration-200;

        /* Visibility control */
        &--visible {
          @apply scale-100 opacity-100;
        }

        /* Content area */
        &__content {
          @apply flex flex-col;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverComponent {
  /** Content component to be displayed. */
  readonly content = input.required<Type<any>>();

  /** Inputs to be passed to the content component. */
  readonly componentInputs = input<Record<string, unknown>>({});

  /** Injector for the content component. */
  readonly injector = input<Injector>();

  /** Popover position. */
  readonly position = input<PopoverPosition>(PopoverPosition.Bottom);

  /** Visibility state. */
  readonly visible = input<boolean>(false);

  /** Computed signal for the container classes. */
  readonly containerClasses = computed(() => {
    const baseClass = 'popover';
    const positionClass = `popover--${this.position()}`;
    const visibleClass = this.visible() ? 'popover--visible' : '';

    return `${baseClass} ${positionClass} ${visibleClass}`;
  });
}
