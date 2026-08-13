import { describe, expect, it } from 'vitest'

import {
  alignDesktop,
  alignMobile,
  gapDesktop,
  gapMobile,
  responsiveToClasses,
} from './responsive'

describe(responsiveToClasses.name, () => {
  it('returns nothing when the prop was not given', () => {
    // Arrange / Act
    const classes = responsiveToClasses(undefined, gapMobile, gapDesktop)

    // Assert
    expect(classes).toEqual([])
  })

  it('reads a plain value as the one that holds on every screen', () => {
    // Arrange / Act
    const classes = responsiveToClasses(4, gapMobile, gapDesktop)

    // Assert
    expect(classes).toEqual(['gap-4'])
  })

  it('keeps the mobile value unprefixed and prefixes the desktop one', () => {
    // Arrange / Act
    const classes = responsiveToClasses(
      { mobile: 2, desktop: 6 },
      gapMobile,
      gapDesktop
    )

    // Assert
    expect(classes).toEqual(['gap-2', 'lg:gap-6'])
  })

  it('emits only the breakpoint that was declared', () => {
    // Arrange / Act
    const desktopOnly = responsiveToClasses(
      { desktop: 8 },
      gapMobile,
      gapDesktop
    )

    // Assert
    expect(desktopOnly).toEqual(['lg:gap-8'])
  })

  it('drops an empty object instead of emitting a stray class', () => {
    // Arrange / Act
    const classes = responsiveToClasses({}, gapMobile, gapDesktop)

    // Assert
    expect(classes).toEqual([])
  })

  it('keeps the zero value, which is a real class and not an absence', () => {
    // Arrange / Act
    const classes = responsiveToClasses({ mobile: 0 }, gapMobile, gapDesktop)

    // Assert
    expect(classes).toEqual(['gap-0'])
  })

  it('works the same for a string scale such as alignment', () => {
    // Arrange / Act
    const classes = responsiveToClasses(
      { mobile: 'start', desktop: 'center' },
      alignMobile,
      alignDesktop
    )

    // Assert
    expect(classes).toEqual(['items-start', 'lg:items-center'])
  })
})
