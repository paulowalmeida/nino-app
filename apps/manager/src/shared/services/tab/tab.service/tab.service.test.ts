import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { TabService } from './tab.service'
import {
  tabServiceAddItemRequestMock,
  tabServiceCancelRequestMock,
  tabServiceCreateRequestMock,
  tabServiceItemIdMock,
  tabServicePayRequestMock,
  tabServiceServiceFeeRequestMock,
  tabServiceTabIdMock,
  tabServiceTabMock,
  tabServiceTabPageMock,
  tabServiceUnitIdMock,
} from './tab.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    get: vi.fn(),
    getAll: vi.fn(),
    create: vi.fn(),
    patch: vi.fn(),
  },
}))

describe('TabService', () => {
  afterEach(() => vi.clearAllMocks())

  it('listTabs: asks for the newest tabs of the given statuses in one page', async () => {
    vi.mocked(api.getAll).mockResolvedValue(tabServiceTabPageMock)

    const page = await TabService.listTabs(tabServiceUnitIdMock, [
      'OPEN',
      'AWAITING_PAYMENT',
    ])

    expect(api.getAll).toHaveBeenCalledWith('units/unit-1/tabs', {
      target: 'createdAt',
      direction: 'desc',
      size: 40,
      page: 1,
      status: 'OPEN,AWAITING_PAYMENT',
    })
    expect(page).toBe(tabServiceTabPageMock)
  })

  it('getById: reads one tab scoped by unit', async () => {
    vi.mocked(api.get).mockResolvedValue(tabServiceTabMock)

    await TabService.getById(tabServiceUnitIdMock, tabServiceTabIdMock)

    expect(api.get).toHaveBeenCalledWith('units/unit-1/tabs/tab-1')
  })

  it('openTab: posts the label', async () => {
    await TabService.openTab(tabServiceUnitIdMock, tabServiceCreateRequestMock)

    expect(api.create).toHaveBeenCalledWith(
      'units/unit-1/tabs',
      tabServiceCreateRequestMock
    )
  })

  it('addItem: posts the item to the tab', async () => {
    await TabService.addItem(
      tabServiceUnitIdMock,
      tabServiceTabIdMock,
      tabServiceAddItemRequestMock
    )

    expect(api.create).toHaveBeenCalledWith(
      'units/unit-1/tabs/tab-1/items',
      tabServiceAddItemRequestMock
    )
  })

  it('cancelItem: patches the item cancellation without a body', async () => {
    await TabService.cancelItem(
      tabServiceUnitIdMock,
      tabServiceTabIdMock,
      tabServiceItemIdMock
    )

    expect(api.patch).toHaveBeenCalledWith(
      'units/unit-1/tabs/tab-1/items/item-1/cancel',
      {}
    )
  })

  it.each([
    ['closeTab', 'close'],
    ['reopenTab', 'reopen'],
  ] as const)('%s: posts to the %s transition', async (operation, segment) => {
    await TabService[operation](tabServiceUnitIdMock, tabServiceTabIdMock)

    expect(api.create).toHaveBeenCalledWith(
      `units/unit-1/tabs/tab-1/${segment}`,
      {}
    )
  })

  it('payTab: posts the method, the part of the bill and the received amount', async () => {
    await TabService.payTab(
      tabServiceUnitIdMock,
      tabServiceTabIdMock,
      tabServicePayRequestMock
    )

    expect(api.create).toHaveBeenCalledWith(
      'units/unit-1/tabs/tab-1/payments',
      tabServicePayRequestMock
    )
  })

  it('setServiceFee: patches whether the service fee stays on the bill', async () => {
    await TabService.setServiceFee(
      tabServiceUnitIdMock,
      tabServiceTabIdMock,
      tabServiceServiceFeeRequestMock
    )

    expect(api.patch).toHaveBeenCalledWith(
      'units/unit-1/tabs/tab-1/service-fee',
      tabServiceServiceFeeRequestMock
    )
  })

  it('cancelTab: posts the cancellation reason', async () => {
    await TabService.cancelTab(
      tabServiceUnitIdMock,
      tabServiceTabIdMock,
      tabServiceCancelRequestMock
    )

    expect(api.create).toHaveBeenCalledWith(
      'units/unit-1/tabs/tab-1/cancel',
      tabServiceCancelRequestMock
    )
  })
})
