import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SettingsHoursSection } from './SettingsHoursSection'
vi.mock('../../facades/useSettingsFacade/useSettingsFacade', () => ({ useSettingsFacade: () => ({ hours: { query: { hours: [], isPending: false }, save: { mutateAsync: vi.fn(), isPending: false } } }) }))
vi.mock('./WeekSchedule/WeekSchedule', () => ({ WeekSchedule: () => <div>hours settings</div> }))
describe(SettingsHoursSection.name, () => { it('renders hours settings', () => { render(<SettingsHoursSection />); expect(screen.getByText('hours settings')).toBeInTheDocument() }) })
