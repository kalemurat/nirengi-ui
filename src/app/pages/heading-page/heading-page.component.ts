import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HeadingComponent,
  HeadingLevel,
  HeadingAlign,
  HeadingWeight,
  Size,
  ColorVariant,
} from 'nirengi-ui-kit';

@Component({
  selector: 'app-heading-page',
  standalone: true,
  imports: [CommonModule, HeadingComponent],
  templateUrl: './heading-page.html',
  styleUrl: './heading-page.scss',
})
export class HeadingPageComponent {
  protected readonly HeadingLevel = HeadingLevel;
  protected readonly HeadingAlign = HeadingAlign;
  protected readonly HeadingWeight = HeadingWeight;
  protected readonly Size = Size;
  protected readonly ColorVariant = ColorVariant;

  protected readonly headingLevels = signal<HeadingLevel[]>([
    HeadingLevel.H1,
    HeadingLevel.H2,
    HeadingLevel.H3,
    HeadingLevel.H4,
    HeadingLevel.H5,
    HeadingLevel.H6,
  ]);

  protected readonly headingSizes = signal<Size[]>([
    Size.XXSmall,
    Size.XSmall,
    Size.Small,
    Size.Medium,
    Size.Large,
    Size.XLarge,
  ]);

  protected readonly headingVariants = signal<ColorVariant[]>([
    ColorVariant.Primary,
    ColorVariant.Secondary,
    ColorVariant.Success,
    ColorVariant.Warning,
    ColorVariant.Danger,
    ColorVariant.Info,
    ColorVariant.Neutral,
  ]);

  protected readonly headingAligns = signal<HeadingAlign[]>([
    HeadingAlign.Left,
    HeadingAlign.Center,
    HeadingAlign.Right,
  ]);

  protected readonly headingWeights = signal<HeadingWeight[]>([
    HeadingWeight.Normal,
    HeadingWeight.Medium,
    HeadingWeight.Semibold,
    HeadingWeight.Bold,
    HeadingWeight.Extrabold,
  ]);
}
