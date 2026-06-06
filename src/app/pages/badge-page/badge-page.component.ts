import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BadgeComponent,
  BadgeType,
  BadgeShape,
} from '../../../../projects/nirengi-ui-kit/src/public-api';
import { ColorVariant } from '../../../../projects/nirengi-ui-kit/src/lib/common/enums/color-variant.enum';
import { Size } from '../../../../projects/nirengi-ui-kit/src/lib/common/enums/size.enum';

@Component({
  selector: 'app-badge-page',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  templateUrl: './badge-page.component.html',
  styleUrl: './badge-page.component.scss',
})
export class BadgePageComponent {
  protected readonly BadgeType = BadgeType;
  protected readonly BadgeShape = BadgeShape;
  protected readonly ColorVariant = ColorVariant;
  protected readonly Size = Size;

  protected readonly colors = Object.values(ColorVariant);
  protected readonly sizes = Object.values(Size);
  protected readonly types = Object.values(BadgeType);
  protected readonly shapes = Object.values(BadgeShape);
}
