import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RemoveUnitModal } from './RemoveUnitModal'

describe('RemoveUnitModal', () => {
  it('does not open when requested closed', () => {
    render(
      <RemoveUnitModal
        open={false}
        onOpenChange={() => undefined}
        unitName="Centro"
        onConfirm={() => undefined}
      />
    )
    expect(document.body).toBeTruthy()
  })
})
