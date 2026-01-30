import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BadgeComponent,
  BadgeType,
  BadgeShape,
} from '../../../../projects/nirengi-ui-kit/src/public-api';
import { ColorVariant } from '../../../../projects/nirengi-ui-kit/src/lib/common/enums/color-variant.enum';
import { Size } from '../../../../projects/nirengi-ui-kit/src/lib/common/enums/size.enum';

/**
 * Badge component showcase sayfası.
 * Tüm badge varyasyonlarını ve özelliklerini sergiler.
 */
@Component({
  selector: 'app-badge-page',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  templateUrl: './badge-page.component.html',
  styleUrl: './badge-page.component.scss',
})
export class BadgePageComponent {
  /** Template erişimi için BadgeType enum referansı */
  protected readonly BadgeType = BadgeType;
  /** Template erişimi için BadgeShape enum referansı */
  protected readonly BadgeShape = BadgeShape;
  /** Template erişimi için ColorVariant enum referansı */
  protected readonly ColorVariant = ColorVariant;
  /** Template erişimi için Size enum referansı */
  protected readonly Size = Size;

  /** Tüm renk varyantları listesi */
  protected readonly colors = Object.values(ColorVariant);
  /** Tüm boyutlar listesi */
  protected readonly sizes = Object.values(Size);
  /** Tüm badge tipleri listesi */
  protected readonly types = Object.values(BadgeType);
  /** Tüm şekil varyantları listesi */
  protected readonly shapes = Object.values(BadgeShape);
}
