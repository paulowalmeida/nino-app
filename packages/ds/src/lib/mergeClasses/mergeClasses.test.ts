import { describe, expect, it } from 'vitest'

import { mergeClasses } from './mergeClasses'

describe(mergeClasses.name, () => {
  it('joins every class it receives', () => {
    // Arrange / Act
    const classes = mergeClasses('flex', 'items-center')

    // Assert
    expect(classes).toBe('flex items-center')
  })

  it('lets the last conflicting Tailwind class win', () => {
    // Arrange / Act
    const classes = mergeClasses('px-4', 'px-8')

    // Assert
    expect(classes).toBe('px-8')
  })

  it('keeps a CSS Module class, since twMerge cannot read it', () => {
    // Arrange
    const moduleClass = '_button_0829c1'

    // Act
    const classes = mergeClasses(moduleClass, 'px-8')

    // Assert
    expect(classes).toBe('_button_0829c1 px-8')
  })

  it('drops falsy conditionals instead of printing them', () => {
    // Arrange
    const isLoading = false

    // Act
    const classes = mergeClasses('flex', isLoading && 'opacity-50', undefined)

    // Assert
    expect(classes).toBe('flex')
  })

  it('flattens arrays and objects the way clsx does', () => {
    // Arrange / Act
    const classes = mergeClasses(['flex', 'gap-2'], { 'sr-only': true })

    // Assert
    expect(classes).toBe('flex gap-2 sr-only')
  })

  it('returns an empty string when there is nothing to merge', () => {
    // Arrange / Act
    const classes = mergeClasses(null, undefined, '', false)

    // Assert
    expect(classes).toBe('')
  })
})
