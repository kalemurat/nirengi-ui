import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    HeadingComponent,
    HeadingLevel,
    HeadingAlign,
    HeadingWeight,
    Size,
    ColorVariant
} from 'nirengi-ui-kit';

/**
 * Heading Component Showcase Sayfası.
 * Heading componentinin tüm varyasyonlarını sergiler.
 */
@Component({
  selector: 'app-heading-page',
  standalone: true,
  imports: [CommonModule, HeadingComponent],
  templateUrl: './heading-page.html',
  styleUrl: './heading-page.scss'
})
export class HeadingPageComponent {
  /** Component enum referansları */
  protected readonly HeadingLevel = HeadingLevel;
  protected readonly HeadingAlign = HeadingAlign;
  protected readonly HeadingWeight = HeadingWeight;
  protected readonly Size = Size;
  protected readonly ColorVariant = ColorVariant;

  /**
   * Heading levels (h1-h6) listesi.
   */
  protected readonly headingLevels = signal<HeadingLevel[]>([
    HeadingLevel.H1,
    HeadingLevel.H2,
    HeadingLevel.H3,
    HeadingLevel.H4,
    HeadingLevel.H5,
    HeadingLevel.H6
  ]);

  /**
   * Heading boyutları listesi.
   */
  protected readonly headingSizes = signal<Size[]>([
    Size.XSmall,
    Size.Small,
    Size.Medium,
    Size.Large,
    Size.XLarge
  ]);

  /**
   * Renk varyasyonları listesi.
   */
  protected readonly headingVariants = signal<ColorVariant[]>([
    ColorVariant.Primary,
    ColorVariant.Secondary,
    ColorVariant.Success,
    ColorVariant.Warning,
    ColorVariant.Danger,
    ColorVariant.Info,
    ColorVariant.Neutral
  ]);

  /**
   * Hizalama seçenekleri listesi.
   */
  protected readonly headingAligns = signal<HeadingAlign[]>([
    HeadingAlign.Left,
    HeadingAlign.Center,
    HeadingAlign.Right
  ]);

  /**
   * Font ağırlıkları listesi.
   */
  protected readonly headingWeights = signal<HeadingWeight[]>([
    HeadingWeight.Normal,
    HeadingWeight.Medium,
    HeadingWeight.Semibold,
    HeadingWeight.Bold,
    HeadingWeight.Extrabold
  ]);
}
