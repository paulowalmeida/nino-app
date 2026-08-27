import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { StaffService } from './staff.service'
import {
  createInviteRequestMock,
  credentialInfoMock,
  inviteResultMock,
  removeStaffMessageMock,
  staffDetailMock,
  staffMemberMock,
  staffPageMock,
  tenantIdMock,
  userIdMock,
} from './staff.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    get: vi.fn(),
    create: vi.fn(),
    patch: vi.fn(),
    remove: vi.fn(),
  },
}))

describe('StaffService', () => {
  afterEach(() => vi.clearAllMocks())

  it('listStaff: reads the tenant staff', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(staffPageMock)

    // Act
    const result = await StaffService.listStaff(tenantIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(`tenants/${tenantIdMock}/staff`)
    expect(result).toBe(staffPageMock)
  })

  it('getById: reads a single staff member by id', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(staffDetailMock)

    // Act
    const result = await StaffService.getById(tenantIdMock, userIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/staff/${userIdMock}`
    )
    expect(result).toBe(staffDetailMock)
  })

  it('sendInvite: posts a new staff invite', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(inviteResultMock)

    // Act
    const result = await StaffService.sendInvite(
      tenantIdMock,
      createInviteRequestMock
    )

    // Assert
    expect(api.create).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/invites`,
      createInviteRequestMock
    )
    expect(result).toBe(inviteResultMock)
  })

  it('updateStaffRole: patches the member role', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(staffMemberMock)

    // Act
    const result = await StaffService.updateStaffRole(
      tenantIdMock,
      userIdMock,
      'MANAGER'
    )

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/staff/${userIdMock}/role`,
      { role: 'MANAGER' }
    )
    expect(result).toBe(staffMemberMock)
  })

  it('updateStaffEmail: patches the member email', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(credentialInfoMock)

    // Act
    const result = await StaffService.updateStaffEmail(
      tenantIdMock,
      userIdMock,
      'novo-email@padoca.com'
    )

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/staff/${userIdMock}/email`,
      { email: 'novo-email@padoca.com' }
    )
    expect(result).toBe(credentialInfoMock)
  })

  it('removeStaff: deletes the member by id', async () => {
    // Arrange
    vi.mocked(api.remove).mockResolvedValue(removeStaffMessageMock)

    // Act
    const result = await StaffService.removeStaff(tenantIdMock, userIdMock)

    // Assert
    expect(api.remove).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/staff/${userIdMock}`
    )
    expect(result).toBe(removeStaffMessageMock)
  })
})
