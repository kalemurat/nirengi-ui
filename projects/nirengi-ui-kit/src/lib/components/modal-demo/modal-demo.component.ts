import { Component, ChangeDetectionStrategy, inject, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { MODAL_SERVICE, MODAL_REF, MODAL_DATA } from '../modal/modal.token';
import { ModalContainerComponent } from '../modal/modal-container.component';
import { ModalSize } from '../modal/modal.types';
import { ColorVariant } from '../../common/enums/color-variant.enum';
import { HeadingComponent, HeadingLevel } from '../heading/heading.component';
import { ParagraphComponent } from '../paragraph/paragraph.component';

/**
 * Simple content component for testing modal.
 */
@Component({
  selector: 'nui-modal-test-content',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ParagraphComponent],
  template: `
    <div class="flex flex-col gap-4">
      <nui-paragraph>
        This content is rendered from a standalone component. Received ID: {{ data?.id }}
      </nui-paragraph>

      <div class="mt-4 flex justify-end gap-2">
        <nui-button [variant]="ColorVariant.Neutral" (clicked)="close()">Cancel</nui-button>
        <nui-button [variant]="ColorVariant.Primary" (clicked)="close('confirmed')"
          >Confirm</nui-button
        >
      </div>
    </div>
  `,
})
export class ModalTestContentComponent {
  modalRef = inject(MODAL_REF);
  data = inject(MODAL_DATA, { optional: true });

  HeadingLevel = HeadingLevel;
  ColorVariant = ColorVariant;

  close(result?: string) {
    this.modalRef.close(result);
  }
}

/**
 * Modal Demo Component.
 */
@Component({
  selector: 'nui-modal-demo',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ModalContainerComponent, HeadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-8">
      <!-- Container is usually in app.component, but put here for demo isolation -->
      <nui-modal-container />

      <nui-heading [level]="HeadingLevel.H2">Modal Examples</nui-heading>

      <div class="flex flex-wrap gap-4">
        <nui-button (clicked)="openComponent()">Open Component</nui-button>
        <nui-button (clicked)="openTemplate(tpl)">Open Template</nui-button>
        <nui-button [variant]="ColorVariant.Info" (clicked)="openWithIcon()"
          >Open With Icon</nui-button
        >
      </div>

      <div class="flex flex-wrap gap-4">
        <nui-button [variant]="ColorVariant.Secondary" (clicked)="openSize(ModalSize.Small)"
          >Small</nui-button
        >
        <nui-button [variant]="ColorVariant.Secondary" (clicked)="openSize(ModalSize.Large)"
          >Large</nui-button
        >
        <nui-button [variant]="ColorVariant.Secondary" (clicked)="openSize(ModalSize.Full)"
          >Full Screen</nui-button
        >
      </div>

      <!-- Template for testing -->
      <ng-template #tpl let-data>
        <div class="flex flex-col gap-4">
          <p>This is a template content. Data: {{ data | json }}</p>
          <div class="flex justify-end">
            <nui-button [variant]="ColorVariant.Neutral" (clicked)="closeAll()"
              >Close All</nui-button
            >
          </div>
        </div>
      </ng-template>
    </div>
  `,
})
export class ModalDemoComponent {
  private modalService = inject(MODAL_SERVICE);

  HeadingLevel = HeadingLevel;
  ColorVariant = ColorVariant;
  ModalSize = ModalSize;

  openComponent() {
    const ref = this.modalService.open(ModalTestContentComponent, {
      title: 'Component Modal',
      data: { id: 123 },
    });

    ref.afterClosedPromise.then((result: any) => {
      console.log('Modal closed with:', result);
    });
  }

  openTemplate(tpl: TemplateRef<any>) {
    this.modalService.open(tpl, {
      title: 'Template Modal',
      data: { info: 'some info' },
    });
  }

  openWithIcon() {
    this.modalService.open(ModalTestContentComponent, {
      title: 'System Alert',
      icon: 'BellRing',
      data: { id: 'alert-01' },
    });
  }

  openSize(size: ModalSize) {
    this.modalService.open(ModalTestContentComponent, {
      size: size,
      title: `${size} Modal`,
    });
  }

  closeAll() {
    this.modalService.closeAll();
  }
}
