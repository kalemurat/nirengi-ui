import { icons } from 'lucide-angular';

/**
 * Tüm mevcut ikonların listesi.
 */
export const ALL_ICONS = icons;

/**
 * İkon isimlerinin tipi.
 */
export type IconName = keyof typeof ALL_ICONS;

/**
 * İkon isimlerinin array hali.
 */
export const IconNames: IconName[] = Object.keys(ALL_ICONS) as IconName[];
