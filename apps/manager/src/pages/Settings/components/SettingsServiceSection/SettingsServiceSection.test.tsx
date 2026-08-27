import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SettingsServiceSection } from './SettingsServiceSection'
vi.mock('../../facades/useSettingsFacade/useSettingsFacade', () => ({ useSettingsFacade: () => ({ service: { query: { data: undefined, isPending: false }, save: { mutate: vi.fn(), isPending: false } } }) }))
vi.mock('./ServiceRules/ServiceRules', () => ({ ServiceRules: () => <div>service settings</div> }))
describe(SettingsServiceSection.name, () => { it('renders service settings', () => { render(<SettingsServiceSection />); expect(screen.getByText('service settings')).toBeInTheDocument() }) })
