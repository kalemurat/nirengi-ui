/**
 * Standard color variants for UI Kit components.
 * Provides color themes with semantic meanings.
 *
 * @example
 * <nui-button [variant]="ColorVariant.Primary">Save</nui-button>
 * <nui-alert [variant]="ColorVariant.Danger">Error message</nui-alert>
 */
export enum ColorVariant {
  /**
   * Primary color.
   * Usage: Main actions, primary CTA buttons, brand color.
   */
  Primary = 'primary',

  /**
   * Secondary color.
   * Usage: Secondary actions, alternative buttons.
   */
  Secondary = 'secondary',

  /**
   * Success color.
   * Usage: Success messages, confirmation states, positive feedback.
   */
  Success = 'success',

  /**
   * Warning color.
   * Usage: Situations requiring attention, warning messages.
   */
  Warning = 'warning',

  /**
   * Danger/Error color.
   * Usage: Error messages, delete actions, critical warnings.
   */
  Danger = 'danger',

  /**
   * Info color.
   * Usage: Informational messages, hints, helpful content.
   */
  Info = 'info',

  /**
   * Neutral/Gray color.
   * Usage: Cancel buttons, disabled states, background.
   */
  Neutral = 'neutral',
}
