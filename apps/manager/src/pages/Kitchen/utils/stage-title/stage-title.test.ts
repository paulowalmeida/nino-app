import { describe, expect, it } from 'vitest'

import { stageTitle } from './stage-title'
import { stageTitleCasesMock } from './stage-title.mock'

describe('stageTitle', () => {
  it('names every stage with the label the rest of the app uses', () => {
    stageTitleCasesMock.forEach(({ stage, title }) =>
      expect(stageTitle(stage)).toBe(title)
    )
  })
})
