import { Responsive, responsiveToClasses } from '@ds/lib/responsive/responsive'

/* Every value appears spelled out in the maps below for the same reason as in
 * `responsive.ts` — Tailwind never sees a class assembled at runtime.
 *
 * Margin, never padding: what spaces from the inside is the box around the
 * text, not the text. Same cut Radix Themes makes in Text and Heading. */

export type SpaceValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24

type ResponsiveSpace = Responsive<SpaceValue>

export type MarginProps = {
  m?: ResponsiveSpace
  mt?: ResponsiveSpace
  mb?: ResponsiveSpace
  mx?: ResponsiveSpace
  my?: ResponsiveSpace
}

const mMobile: Record<SpaceValue, string> = {
  0: 'm-0',
  1: 'm-1',
  2: 'm-2',
  3: 'm-3',
  4: 'm-4',
  5: 'm-5',
  6: 'm-6',
  8: 'm-8',
  10: 'm-10',
  12: 'm-12',
  16: 'm-16',
  20: 'm-20',
  24: 'm-24',
}

const mDesktop: Record<SpaceValue, string> = {
  0: 'lg:m-0',
  1: 'lg:m-1',
  2: 'lg:m-2',
  3: 'lg:m-3',
  4: 'lg:m-4',
  5: 'lg:m-5',
  6: 'lg:m-6',
  8: 'lg:m-8',
  10: 'lg:m-10',
  12: 'lg:m-12',
  16: 'lg:m-16',
  20: 'lg:m-20',
  24: 'lg:m-24',
}

const mtMobile: Record<SpaceValue, string> = {
  0: 'mt-0',
  1: 'mt-1',
  2: 'mt-2',
  3: 'mt-3',
  4: 'mt-4',
  5: 'mt-5',
  6: 'mt-6',
  8: 'mt-8',
  10: 'mt-10',
  12: 'mt-12',
  16: 'mt-16',
  20: 'mt-20',
  24: 'mt-24',
}

const mtDesktop: Record<SpaceValue, string> = {
  0: 'lg:mt-0',
  1: 'lg:mt-1',
  2: 'lg:mt-2',
  3: 'lg:mt-3',
  4: 'lg:mt-4',
  5: 'lg:mt-5',
  6: 'lg:mt-6',
  8: 'lg:mt-8',
  10: 'lg:mt-10',
  12: 'lg:mt-12',
  16: 'lg:mt-16',
  20: 'lg:mt-20',
  24: 'lg:mt-24',
}

const mbMobile: Record<SpaceValue, string> = {
  0: 'mb-0',
  1: 'mb-1',
  2: 'mb-2',
  3: 'mb-3',
  4: 'mb-4',
  5: 'mb-5',
  6: 'mb-6',
  8: 'mb-8',
  10: 'mb-10',
  12: 'mb-12',
  16: 'mb-16',
  20: 'mb-20',
  24: 'mb-24',
}

const mbDesktop: Record<SpaceValue, string> = {
  0: 'lg:mb-0',
  1: 'lg:mb-1',
  2: 'lg:mb-2',
  3: 'lg:mb-3',
  4: 'lg:mb-4',
  5: 'lg:mb-5',
  6: 'lg:mb-6',
  8: 'lg:mb-8',
  10: 'lg:mb-10',
  12: 'lg:mb-12',
  16: 'lg:mb-16',
  20: 'lg:mb-20',
  24: 'lg:mb-24',
}

const mxMobile: Record<SpaceValue, string> = {
  0: 'mx-0',
  1: 'mx-1',
  2: 'mx-2',
  3: 'mx-3',
  4: 'mx-4',
  5: 'mx-5',
  6: 'mx-6',
  8: 'mx-8',
  10: 'mx-10',
  12: 'mx-12',
  16: 'mx-16',
  20: 'mx-20',
  24: 'mx-24',
}

const mxDesktop: Record<SpaceValue, string> = {
  0: 'lg:mx-0',
  1: 'lg:mx-1',
  2: 'lg:mx-2',
  3: 'lg:mx-3',
  4: 'lg:mx-4',
  5: 'lg:mx-5',
  6: 'lg:mx-6',
  8: 'lg:mx-8',
  10: 'lg:mx-10',
  12: 'lg:mx-12',
  16: 'lg:mx-16',
  20: 'lg:mx-20',
  24: 'lg:mx-24',
}

const myMobile: Record<SpaceValue, string> = {
  0: 'my-0',
  1: 'my-1',
  2: 'my-2',
  3: 'my-3',
  4: 'my-4',
  5: 'my-5',
  6: 'my-6',
  8: 'my-8',
  10: 'my-10',
  12: 'my-12',
  16: 'my-16',
  20: 'my-20',
  24: 'my-24',
}

const myDesktop: Record<SpaceValue, string> = {
  0: 'lg:my-0',
  1: 'lg:my-1',
  2: 'lg:my-2',
  3: 'lg:my-3',
  4: 'lg:my-4',
  5: 'lg:my-5',
  6: 'lg:my-6',
  8: 'lg:my-8',
  10: 'lg:my-10',
  12: 'lg:my-12',
  16: 'lg:my-16',
  20: 'lg:my-20',
  24: 'lg:my-24',
}

const marginClasses = {
  m: { mobile: mMobile, desktop: mDesktop },
  mt: { mobile: mtMobile, desktop: mtDesktop },
  mb: { mobile: mbMobile, desktop: mbDesktop },
  mx: { mobile: mxMobile, desktop: mxDesktop },
  my: { mobile: myMobile, desktop: myDesktop },
}

const sideToClasses = (
  side: keyof MarginProps,
  space: ResponsiveSpace | undefined
) => {
  const scale = marginClasses[side]

  return responsiveToClasses(space, scale.mobile, scale.desktop)
}

/**
 * Turns the margin props a component received into the Tailwind classes for
 * each declared side, skipping the sides left out.
 */
export const marginToClasses = ({ m, mt, mb, mx, my }: MarginProps) => [
  ...sideToClasses('m', m),
  ...sideToClasses('mt', mt),
  ...sideToClasses('mb', mb),
  ...sideToClasses('mx', mx),
  ...sideToClasses('my', my),
]
