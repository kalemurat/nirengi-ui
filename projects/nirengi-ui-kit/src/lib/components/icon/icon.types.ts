import { icons } from 'lucide-angular';

export const ALL_ICONS = icons;

export type IconName = keyof typeof ALL_ICONS;

export const IconNames: IconName[] = Object.keys(ALL_ICONS) as IconName[];
