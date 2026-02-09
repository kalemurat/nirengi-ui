/**
 * Standard size values for UI Kit components.
 * Used to ensure consistent sizing across all components.
 *
 * @example
 * <nui-button [size]="Size.Medium">Save</nui-button>
 * <nui-input [size]="Size.Large"></nui-input>
 */
export enum Size {
  /**
   * Extra small size.
   * Usage: Very compact areas, icon buttons, chips.
   */
  XSmall = 'xs',

  /**
   * Small size.
   * Usage: Compact lists, secondary actions, badges.
   */
  Small = 'sm',

  /**
   * Medium size (default).
   * Usage: Standard form elements, buttons, most components.
   */
  Medium = 'md',

  /**
   * Large size.
   * Usage: Emphasized actions, hero sections.
   */
  Large = 'lg',

  /**
   * Extra large size.
   * Usage: Landing pages, special emphasizes, hero buttons.
   */
  XLarge = 'xl',
}
