import { describe, expect, it } from 'vitest'

import { toggleTabModifierOption } from './toggleTabModifierOption'
import { toggleTabModifierOptionMock } from './toggleTabModifierOption.mock'

const { single, multiple } = toggleTabModifierOptionMock

describe('toggleTabModifierOption', () => {
  it('replaces the choice of a single-choice group', () => {
    expect(
      toggleTabModifierOption(
        { [single.id]: ['option-1'] },
        single,
        'option-2',
        true
      )
    ).toEqual({ [single.id]: ['option-2'] })
  })

  it('clears a single-choice group when its option is unchecked', () => {
    expect(
      toggleTabModifierOption(
        { [single.id]: ['option-1'] },
        single,
        'option-1',
        false
      )
    ).toEqual({ [single.id]: [] })
  })

  it('adds options of a multiple-choice group without duplicating', () => {
    const once = toggleTabModifierOption({}, multiple, 'option-1', true)
    const twice = toggleTabModifierOption(once, multiple, 'option-1', true)

    expect(twice).toEqual({ [multiple.id]: ['option-1'] })
  })

  it('removes an unchecked option and keeps the others', () => {
    expect(
      toggleTabModifierOption(
        { [multiple.id]: ['option-1', 'option-2'] },
        multiple,
        'option-1',
        false
      )
    ).toEqual({ [multiple.id]: ['option-2'] })
  })

  it('never keeps more options than the group allows', () => {
    expect(
      toggleTabModifierOption(
        { [multiple.id]: ['option-1', 'option-2'] },
        multiple,
        'option-3',
        true
      )
    ).toEqual({ [multiple.id]: ['option-1', 'option-2'] })
  })

  it('keeps the other groups untouched', () => {
    expect(
      toggleTabModifierOption({ other: ['option-9'] }, single, 'option-1', true)
    ).toEqual({ other: ['option-9'], [single.id]: ['option-1'] })
  })
})
