import { icons } from 'lucide-angular';

/**
 * List of all available icons.
 */
export const ALL_ICONS = icons;

/**
 * Type of icon names.
 */
export type IconName = keyof typeof ALL_ICONS;

/**
 * Array form of icon names.
 */
export const IconNames: IconName[] = Object.keys(ALL_ICONS) as IconName[];

