import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SettingsDeliverySection } from './SettingsDeliverySection'
vi.mock('../../facades/useSettingsFacade/useSettingsFacade', () => ({ useSettingsFacade: () => ({ delivery: { query: { zones: [], isPending: false }, mutations: { add: { mutate: vi.fn(), isPending: false }, edit: { mutate: vi.fn() }, toggle: { mutate: vi.fn() }, drop: { mutate: vi.fn() } } } }) }))
vi.mock('./ZoneList/ZoneList', () => ({ ZoneList: () => <div>delivery settings</div> }))
describe(SettingsDeliverySection.name, () => { it('renders delivery settings', () => { render(<SettingsDeliverySection />); expect(screen.getByText('delivery settings')).toBeInTheDocument() }) })
