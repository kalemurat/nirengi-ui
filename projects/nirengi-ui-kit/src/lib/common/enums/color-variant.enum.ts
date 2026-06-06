/**
 * Standard color variants for UI Kit components.
 *
 * @example
 * <nui-button [variant]="ColorVariant.Primary">Save</nui-button>
 * <nui-alert [variant]="ColorVariant.Danger">Error message</nui-alert>
 */
export enum ColorVariant {
  /** Main actions, primary CTA buttons, brand color. */
  Primary = 'primary',

  /** Secondary actions, alternative buttons. */
  Secondary = 'secondary',

  /** Success messages, confirmation states, positive feedback. */
  Success = 'success',

  /** Situations requiring attention, warning messages. */
  Warning = 'warning',

  /** Error messages, delete actions, critical warnings. */
  Danger = 'danger',

  /** Informational messages, hints, helpful content. */
  Info = 'info',

  /** Cancel buttons, disabled states, background. */
  Neutral = 'neutral',
}
