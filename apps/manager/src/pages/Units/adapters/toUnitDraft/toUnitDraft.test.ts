import { describe, expect, it } from 'vitest'

import { toUnitDraft } from './toUnitDraft'
import { unitDetailMock } from './toUnitDraft.mock'

describe('toUnitDraft', () => {
  it('keeps the saved brand colors and falls back for the missing ones', () => {
    const draft = toUnitDraft(unitDetailMock)

    expect(draft.primaryColor).toBe('#FF6B00')
    expect(draft.secondaryColor).toBe('#1F2937')
    expect(draft.backgroundColor).toBe('#FFFFFF')
  })

  it('puts the unit own city first and keeps it once', () => {
    const draft = toUnitDraft(unitDetailMock)

    expect(draft.deliveryCities).toEqual([
      { city: 'São Paulo', state: 'SP' },
      { city: 'Osasco', state: 'SP' },
    ])
  })

  it('turns absent optional text into empty fields', () => {
    const draft = toUnitDraft({ ...unitDetailMock, customName: undefined })

    expect(draft.customName).toBe('')
    expect(draft.complement).toBe('')
  })

  it('keeps the saved asset URLs in the editable draft', () => {
    const draft = toUnitDraft({
      ...unitDetailMock,
      logoUrl: 'https://cdn.example/logo.png',
      bannerUrl: 'https://cdn.example/banner.png',
    })

    expect(draft.logoUrl).toBe('https://cdn.example/logo.png')
    expect(draft.bannerUrl).toBe('https://cdn.example/banner.png')
  })
})
