import { ALL_ICONS } from './icon-data';

export { ALL_ICONS };

/**
 * Every RemixIcon name bundled with the kit, in upstream kebab-case
 * (`home-line`, `check-fill`, …) — the same names listed on remixicon.com,
 * minus the `ri-` CSS prefix.
 */
export type IconName = keyof typeof ALL_ICONS;

export const IconNames: IconName[] = Object.keys(ALL_ICONS) as IconName[];
