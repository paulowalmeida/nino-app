import { describe, expect, it } from 'vitest'

import { isConsultativePlan } from './isConsultativePlan'
import {
  consultativePlanMock,
  standardPlanMock,
} from './isConsultativePlan.mock'

describe(isConsultativePlan.name, () => {
  it('recognizes the Rede plan as consultative', () => {
    expect(isConsultativePlan(consultativePlanMock)).toBe(true)
  })

  it('keeps regular plans in the self-service flow', () => {
    expect(isConsultativePlan(standardPlanMock)).toBe(false)
  })
})
