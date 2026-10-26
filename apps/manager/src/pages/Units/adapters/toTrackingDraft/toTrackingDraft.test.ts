import { describe, expect, it } from 'vitest'

import { toTrackingDraft } from './toTrackingDraft'
import {
  configWithoutTrackingMock,
  configWithTrackingMock,
} from './toTrackingDraft.mock'

describe('toTrackingDraft', () => {
  it('fills the editor with the labels the store already wrote', () => {
    const draft = toTrackingDraft(configWithTrackingMock)

    expect(draft.stageLabels.PENDING).toBe('Pedido na casa')
    expect(draft.waitingMessage).toBe('Separa o guardanapo.')
  })

  it('leaves untouched stages empty so the default text shows', () => {
    expect(toTrackingDraft(configWithTrackingMock).stageLabels.DELIVERED).toBe(
      ''
    )
  })

  it('handles a document published before tracking existed', () => {
    const draft = toTrackingDraft(configWithoutTrackingMock)

    expect(draft.stageLabels.PREPARING).toBe('')
    expect(draft.waitingMessage).toBe('')
  })
})
