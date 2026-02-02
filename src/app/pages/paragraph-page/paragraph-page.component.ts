import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ParagraphComponent,
  ParagraphAlign,
  ParagraphWeight,
  Size,
  ColorVariant,
} from 'nirengi-ui-kit';

/**
 * Paragraph Component Showcase Sayfası.
 * Paragraph componentinin tüm varyasyonlarını sergiler.
 *
 * ## Özellikler
 * - ✅ OnPush change detection stratejisi
 * - ✅ Signal tabanlı state yönetimi
 * - ✅ Comprehensive component showcase
 * - ✅ BEM + Tailwind metodolojisi
 *
 * @see {@link ParagraphComponent}
 */
@Component({
  selector: 'app-paragraph-page',
  standalone: true,
  imports: [CommonModule, ParagraphComponent],
  templateUrl: './paragraph-page.component.html',
  styleUrl: './paragraph-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParagraphPageComponent {
  /** Component enum referansları */
  protected readonly ParagraphAlign = ParagraphAlign;
  protected readonly ParagraphWeight = ParagraphWeight;
  protected readonly Size = Size;
  protected readonly ColorVariant = ColorVariant;

  /**
   * Paragraph boyutları listesi.
   */
  protected readonly paragraphSizes = signal<Size[]>([
    Size.XSmall,
    Size.Small,
    Size.Medium,
    Size.Large,
    Size.XLarge,
  ]);

  /**
   * Renk varyasyonları listesi.
   */
  protected readonly paragraphVariants = signal<ColorVariant[]>([
    ColorVariant.Primary,
    ColorVariant.Secondary,
    ColorVariant.Success,
    ColorVariant.Warning,
    ColorVariant.Danger,
    ColorVariant.Info,
    ColorVariant.Neutral,
  ]);

  /**
   * Hizalama seçenekleri listesi.
   */
  protected readonly paragraphAligns = signal<ParagraphAlign[]>([
    ParagraphAlign.Left,
    ParagraphAlign.Center,
    ParagraphAlign.Right,
    ParagraphAlign.Justify,
  ]);

  /**
   * Font ağırlıkları listesi.
   */
  protected readonly paragraphWeights = signal<ParagraphWeight[]>([
    ParagraphWeight.Light,
    ParagraphWeight.Normal,
    ParagraphWeight.Medium,
    ParagraphWeight.Semibold,
    ParagraphWeight.Bold,
  ]);

  /**
   * Leading (satır yüksekliği) seçenekleri listesi.
   */
  protected readonly leadingOptions = signal<
    ('none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose')[]
  >(['none', 'tight', 'snug', 'normal', 'relaxed', 'loose']);

  /**
   * Örnek paragraf metni.
   */
  protected readonly sampleText = signal<string>(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  );

  /**
   * Uzun örnek paragraf metni (line clamp için).
   */
  protected readonly longSampleText = signal<string>(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  );
}
