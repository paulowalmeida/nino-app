import { HTMLAttributes } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'
import { MarginProps, marginToClasses } from '@ds/lib/spacing/spacing'
import {
  TextAlign,
  textAlignClasses,
  TextColor,
  textColorClasses,
} from '@ds/lib/textStyles/textStyles'

import styles from './Text.module.css'

type TextTag = 'p' | 'span' | 'strong' | 'em'
type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
type TextCase = 'uppercase' | 'lowercase' | 'capitalize'
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
type TextFont = 'sans' | 'display'

type TextProps = HTMLAttributes<HTMLElement> &
  MarginProps & {
    /**
     * Tag to render: `p` (own block), `span` (inline, inside a sentence),
     * `strong` or `em` (inline emphasis a screen reader announces). Default:
     * `p`
     */
    as?: TextTag
    /** Entry from the DS type scale. Default: `base` */
    size?: TextSize
    /** Entry from the DS text color tokens. Default: `default` */
    color?: TextColor
    /** Text alignment. Default: `left` */
    align?: TextAlign
    /** Letter case transform. Default: none, text as written */
    case?: TextCase
    /** Font weight. Default: none, inherits from the surface */
    weight?: TextWeight
    /**
     * `sans` (default body face) or `display` (the heading face, for a label
     * that carries a title's weight without being one)
     */
    font?: TextFont
  }

const sizeClasses: Record<TextSize, string> = {
  xs: styles.sizeExtraSmall,
  sm: styles.sizeSmall,
  base: styles.sizeBase,
  lg: styles.sizeLarge,
  xl: styles.sizeExtraLarge,
  '2xl': styles.size2Xl,
  '3xl': styles.size3Xl,
}

const weightClasses: Record<TextWeight, string> = {
  normal: styles.weightNormal,
  medium: styles.weightMedium,
  semibold: styles.weightSemibold,
  bold: styles.weightBold,
  extrabold: styles.weightExtrabold,
}

const fontClasses: Record<TextFont, string> = {
  sans: styles.fontSans,
  display: styles.fontDisplay,
}

const caseClasses: Record<TextCase, string> = {
  uppercase: styles.caseUppercase,
  lowercase: styles.caseLowercase,
  capitalize: styles.caseCapitalize,
}

/**
 * Body text over the DS type scale. Never a heading — a rank in the
 * document outline is `Heading`'s job, and keeping the two apart is what
 * stops a page from growing a second `h1`.
 *
 * ```tsx
 * <Text>Pedido confirmado</Text>
 * <Text as="span" color="brand">R$ 42,00</Text>
 * <Text size="sm" color="faint" case="uppercase" mt={1}>Observações</Text>
 *
 * - `m` — Margin on every side, from the Tailwind spacing scale. `mt`, `mb`, `mx` and `my` narrow it to one axis or side
 * - `className` — Additional CSS classes
 * ```
 */
export function Text({
  as: Component = 'p',
  size = 'base',
  color = 'default',
  align = 'left',
  case: textCase,
  weight,
  font,
  m,
  mt,
  mb,
  mx,
  my,
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Component
      className={mergeClasses(
        sizeClasses[size],
        textColorClasses[color],
        textAlignClasses[align],
        textCase && caseClasses[textCase],
        weight && weightClasses[weight],
        font && fontClasses[font],
        marginToClasses({ m, mt, mb, mx, my }),
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
