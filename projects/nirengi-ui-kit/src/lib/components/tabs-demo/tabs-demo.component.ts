import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from '../tabs/tabs.component';
import { TabComponent } from '../tabs/tab.component';
import { HeadingComponent, HeadingLevel, HeadingWeight } from '../heading/heading.component';
import { ParagraphComponent, ParagraphAlign } from '../paragraph/paragraph.component';

import { ColorVariant } from '../../common/enums/color-variant.enum';
import { Size } from '../../common/enums/size.enum';

/**
 * Tabs Demo Component for Showcase.
 * Demonstrates various configurations of the Tabs component, controlled by properties panel.
 */
@Component({
  selector: 'nui-tabs-demo',
  standalone: true,
  imports: [CommonModule, TabsComponent, TabComponent, HeadingComponent, ParagraphComponent],
  template: `
    <div class="flex flex-col gap-8">
      <!-- Live Preview -->
      <section>
        <nui-heading [level]="HeadingLevel.H3" [weight]="HeadingWeight.Bold" [marginBottom]="true">
          Interactive Demo
        </nui-heading>
        <nui-paragraph [size]="Size.Small" [marginBottom]="true">
          Control the properties of this tabs component using the panel on the right.
        </nui-paragraph>

        <nui-tabs [variant]="variant()" [size]="size()" [fullWidth]="fullWidth()">
          <nui-tab label="Account">
            <div class="rounded bg-gray-50 p-4 dark:bg-gray-800">
              <nui-paragraph>Account settings content goes here.</nui-paragraph>
              <div class="mt-2">
                <nui-paragraph [size]="Size.Small">
                  Current Variant: {{ variant() }}<br />
                  Current Size: {{ size() }}<br />
                  Full Width: {{ fullWidth() }}
                </nui-paragraph>
              </div>
            </div>
          </nui-tab>
          <nui-tab label="Password">
            <div class="rounded bg-gray-50 p-4 dark:bg-gray-800">
              <nui-paragraph>Password change form goes here.</nui-paragraph>
            </div>
          </nui-tab>
          <nui-tab label="Notifications" [disabled]="true">
            <div class="rounded bg-gray-50 p-4 dark:bg-gray-800">
              <nui-paragraph>Notification preferences content.</nui-paragraph>
            </div>
          </nui-tab>
        </nui-tabs>
      </section>

      <!-- Full Width Example -->
      <section>
        <nui-heading [level]="HeadingLevel.H3" [weight]="HeadingWeight.Bold" [marginBottom]="true">
          Full Width
        </nui-heading>
        <nui-tabs [fullWidth]="true">
          <nui-tab label="First Tab">
            <div class="p-4">
              <nui-paragraph [align]="ParagraphAlign.Center">First Content</nui-paragraph>
            </div>
          </nui-tab>
          <nui-tab label="Second Tab">
            <div class="p-4">
              <nui-paragraph [align]="ParagraphAlign.Center">Second Content</nui-paragraph>
            </div>
          </nui-tab>
          <nui-tab label="Third Tab">
            <div class="p-4">
              <nui-paragraph [align]="ParagraphAlign.Center">Third Content</nui-paragraph>
            </div>
          </nui-tab>
        </nui-tabs>
      </section>

      <!-- Custom Template Example -->
      <section>
        <nui-heading [level]="HeadingLevel.H3" [weight]="HeadingWeight.Bold" [marginBottom]="true">
          Custom Template (Icons)
        </nui-heading>
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
            <div class="p-4">
              <nui-paragraph>Profile Content with Icon</nui-paragraph>
            </div>
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
            <div class="p-4">
              <nui-paragraph>Contact Content with Icon</nui-paragraph>
            </div>
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

  // Expose enums to template
  readonly HeadingLevel = HeadingLevel;
  readonly HeadingWeight = HeadingWeight;
  readonly ParagraphAlign = ParagraphAlign;
  readonly Size = Size;
  readonly ColorVariant = ColorVariant;
}
