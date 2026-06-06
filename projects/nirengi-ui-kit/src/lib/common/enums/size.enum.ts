/**
 * Standard size values for UI Kit components.
 * Used to ensure consistent sizing across all components.
 *
 * @example
 * <nui-button [size]="Size.Medium">Save</nui-button>
 * <nui-input [size]="Size.Large"></nui-input>
 */
export enum Size {
  /** The lowest typographic level (e.g. h6 headings), dense captions. */
  XXSmall = '2xs',

  /** Very compact areas, icon buttons, chips. */
  XSmall = 'xs',

  /** Compact lists, secondary actions, badges. */
  Small = 'sm',

  /** Standard form elements, buttons, most components. Default size. */
  Medium = 'md',

  /** Emphasized actions, hero sections. */
  Large = 'lg',

  /** Landing pages, special emphasizes, hero buttons. */
  XLarge = 'xl',
}
