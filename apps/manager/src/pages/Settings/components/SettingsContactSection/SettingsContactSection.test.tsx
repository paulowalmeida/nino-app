import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SettingsContactSection } from './SettingsContactSection'
vi.mock('../../facades/useSettingsFacade/useSettingsFacade', () => ({ useSettingsFacade: () => ({ contact: { query: { phones: [], isPending: false }, mutations: { add: { mutate: vi.fn(), isPending: false }, edit: { mutate: vi.fn() }, drop: { mutate: vi.fn() } } } }) }))
vi.mock('./PhoneList/PhoneList', () => ({ PhoneList: () => <div>contact settings</div> }))
describe(SettingsContactSection.name, () => { it('renders contact settings', () => { render(<SettingsContactSection />); expect(screen.getByText('contact settings')).toBeInTheDocument() }) })
