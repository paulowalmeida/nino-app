import { Slider as ArkSlider } from '@ark-ui/react/slider'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Slider.module.css'

type SliderProps = {
  /**
   * Controlled value. Leave it out and pass `defaultValue` to let the
   * component keep its own
   */
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  /** Floor. Default: `0` */
  min?: number
  /** Ceiling. Default: `100` */
  max?: number
  /** How much each notch moves. Default: `1` */
  step?: number
  disabled?: boolean
  /** Text above the rail, tied to it for screen readers */
  label?: string
  /**
   * Puts the current number beside the label, which is the only way to read
   * the exact value without dragging
   */
  showValue?: boolean
  className?: string
}

/**
 * Handle dragged along a rail to pick a number — a price ceiling, a radius,
 * a percentage.
 *
 * Reach for it when the exact number matters less than the sense of more or
 * less. When the person knows the figure they want, a `NumberInput` gets
 * there in one gesture instead of a dozen.
 *
 * @example
 * <Slider label="Raio de entrega" showValue max={20} onValueChange={setKm} />
 */

export function Slider({
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  label,
  showValue,
  className,
}: SliderProps) {
  return (
    <ArkSlider.Root
      value={value !== undefined ? [value] : undefined}
      defaultValue={defaultValue !== undefined ? [defaultValue] : undefined}
      onValueChange={({ value: v }) => onValueChange?.(v[0])}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      className={mergeClasses(styles.slider, className)}
    >
      {(label || showValue) && (
        <ArkSlider.Label className={styles.labelRow}>
          <span>{label}</span>
          {showValue && <ArkSlider.ValueText className={styles.valueText} />}
        </ArkSlider.Label>
      )}
      <ArkSlider.Control className={styles.trackRow}>
        <ArkSlider.Track className={styles.track}>
          <ArkSlider.Range className={styles.fill} />
        </ArkSlider.Track>
        <ArkSlider.Thumb index={0} className={styles.handle}>
          <ArkSlider.HiddenInput />
        </ArkSlider.Thumb>
      </ArkSlider.Control>
    </ArkSlider.Root>
  )
}
