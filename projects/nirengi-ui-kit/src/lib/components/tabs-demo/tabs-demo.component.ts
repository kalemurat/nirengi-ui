import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from '../tabs/tabs.component';
import { TabComponent } from '../tabs/tab.component';

import { ColorVariant } from '../../common/enums/color-variant.enum';
import { Size } from '../../common/enums/size.enum';

/**
 * Tabs Demo Component for Showcase.
 * Demonstrates various configurations of the Tabs component, controlled by properties panel.
 */
@Component({
  selector: 'nui-tabs-demo',
  standalone: true,
  imports: [CommonModule, TabsComponent, TabComponent],
  template: `
    <div class="flex flex-col gap-8">
      <!-- Live Preview -->
      <section>
        <h3 class="mb-4 text-lg font-bold">Interactive Demo</h3>
        <p class="mb-4 text-sm text-gray-500">
          Control the properties of this tabs component using the panel on the right.
        </p>

        <nui-tabs [variant]="variant()" [size]="size()" [fullWidth]="fullWidth()">
          <nui-tab label="Account">
            <div class="rounded bg-gray-50 p-4 dark:bg-gray-800">
              <p>Account settings content goes here.</p>
              <p class="mt-2 text-sm text-gray-500">
                Current Variant: {{ variant() }}<br />
                Current Size: {{ size() }}<br />
                Full Width: {{ fullWidth() }}
              </p>
            </div>
          </nui-tab>
          <nui-tab label="Password">
            <div class="rounded bg-gray-50 p-4 dark:bg-gray-800">
              <p>Password change form goes here.</p>
            </div>
          </nui-tab>
          <nui-tab label="Notifications" [disabled]="true">
            <div class="rounded bg-gray-50 p-4 dark:bg-gray-800">
              <p>Notification preferences content.</p>
            </div>
          </nui-tab>
        </nui-tabs>
      </section>

      <!-- Full Width Example -->
      <section>
        <h3 class="mb-4 text-lg font-bold">Full Width</h3>
        <nui-tabs [fullWidth]="true">
          <nui-tab label="First Tab">
            <div class="p-4 text-center">First Content</div>
          </nui-tab>
          <nui-tab label="Second Tab">
            <div class="p-4 text-center">Second Content</div>
          </nui-tab>
          <nui-tab label="Third Tab">
            <div class="p-4 text-center">Third Content</div>
          </nui-tab>
        </nui-tabs>
      </section>

      <!-- Custom Template Example -->
      <section>
        <h3 class="mb-4 text-lg font-bold">Custom Template (Icons)</h3>
        <nui-tabs>
          <nui-tab>
            <ng-template nuiTabLabel>
              <div class="flex items-center gap-2">
                <!-- Simple SVG Icon for Demo -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Profile</span>
              </div>
            </ng-template>
            <div class="p-4">Profile Content with Icon</div>
          </nui-tab>
          <nui-tab>
            <ng-template nuiTabLabel>
              <div class="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                  ></path>
                </svg>
                <span>Contact</span>
              </div>
            </ng-template>
            <div class="p-4">Contact Content with Icon</div>
          </nui-tab>
        </nui-tabs>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsDemoComponent {
  /**
   * Controlled by Showcase Properties Panel
   */
  readonly variant = input<ColorVariant>(ColorVariant.Primary);
  readonly size = input<Size>(Size.Medium);
  readonly fullWidth = input<boolean>(false);
}
