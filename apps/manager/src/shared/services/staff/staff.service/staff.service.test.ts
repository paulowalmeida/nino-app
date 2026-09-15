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
  unitIdMock,
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

  it('listStaff: reads the unit staff', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(staffPageMock)

    // Act
    const result = await StaffService.listStaff(unitIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(`units/${unitIdMock}/staff`)
    expect(result).toBe(staffPageMock)
  })

  it('getById: reads a single staff member by id', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(staffDetailMock)

    // Act
    const result = await StaffService.getById(unitIdMock, userIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(
      `units/${unitIdMock}/staff/${userIdMock}`
    )
    expect(result).toBe(staffDetailMock)
  })

  it('sendInvite: posts a new staff invite', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(inviteResultMock)

    // Act
    const result = await StaffService.sendInvite(
      unitIdMock,
      createInviteRequestMock
    )

    // Assert
    expect(api.create).toHaveBeenCalledWith(
      `units/${unitIdMock}/invites`,
      createInviteRequestMock
    )
    expect(result).toBe(inviteResultMock)
  })

  it('updateStaffRole: patches the member role', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(staffMemberMock)

    // Act
    const result = await StaffService.updateStaffRole(
      unitIdMock,
      userIdMock,
      'MANAGER'
    )

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `units/${unitIdMock}/staff/${userIdMock}/role`,
      { role: 'MANAGER' }
    )
    expect(result).toBe(staffMemberMock)
  })

  it('updateStaffEmail: patches the member email', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(credentialInfoMock)

    // Act
    const result = await StaffService.updateStaffEmail(
      unitIdMock,
      userIdMock,
      'novo-email@padoca.com'
    )

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `units/${unitIdMock}/staff/${userIdMock}/email`,
      { email: 'novo-email@padoca.com' }
    )
    expect(result).toBe(credentialInfoMock)
  })

  it('removeStaff: deletes the member by id', async () => {
    // Arrange
    vi.mocked(api.remove).mockResolvedValue(removeStaffMessageMock)

    // Act
    const result = await StaffService.removeStaff(unitIdMock, userIdMock)

    // Assert
    expect(api.remove).toHaveBeenCalledWith(
      `units/${unitIdMock}/staff/${userIdMock}`
    )
    expect(result).toBe(removeStaffMessageMock)
  })
})
