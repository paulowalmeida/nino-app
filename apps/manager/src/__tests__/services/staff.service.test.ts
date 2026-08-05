import { describe, expect, it, vi } from 'vitest'

import { apiMock } from './http.service.mock'

vi.mock('@services/http.service', () => ({ api: apiMock }))

const { StaffService } = await import('@services/staff.service')

describe('StaffService', () => {
  it('listStaff: reads GET tenants/:id/staff', async () => {
    // Arrange
    apiMock.get.mockResolvedValueOnce({ data: [], pagination: { total: 0 } })

    // Act
    const result = await StaffService.listStaff('tenant-1')

    // Assert
    expect(apiMock.get).toHaveBeenCalledWith('tenants/tenant-1/staff')
    expect(result).toEqual({ data: [], pagination: { total: 0 } })
  })

  it('getById: reads GET tenants/:id/staff/:userId', async () => {
    // Arrange
    apiMock.get.mockResolvedValueOnce({ id: 'user-1' })

    // Act
    const result = await StaffService.getById('tenant-1', 'user-1')

    // Assert
    expect(apiMock.get).toHaveBeenCalledWith('tenants/tenant-1/staff/user-1')
    expect(result).toEqual({ id: 'user-1' })
  })

  it('sendInvite: creates an invite under the tenant', async () => {
    // Arrange
    const data = {
      email: 'novo@nino.delivery',
      kind: 'STAFF' as const,
      role: 'MANAGER' as const,
    }
    apiMock.create.mockResolvedValueOnce({
      id: 'invite-1',
      email: data.email,
    })

    // Act
    const result = await StaffService.sendInvite('tenant-1', data)

    // Assert
    expect(apiMock.create).toHaveBeenCalledWith(
      'tenants/tenant-1/invites',
      data
    )
    expect(result).toEqual({ id: 'invite-1', email: data.email })
  })

  it('updateStaffRole: patches the role sub-resource of a staff member', async () => {
    // Arrange / Act
    await StaffService.updateStaffRole('tenant-1', 'user-1', 'MANAGER')

    // Assert
    expect(apiMock.patch).toHaveBeenCalledWith(
      'tenants/tenant-1/staff/user-1/role',
      { role: 'MANAGER' }
    )
  })

  it('updateStaffEmail: patches the email sub-resource of a staff member', async () => {
    // Arrange / Act
    await StaffService.updateStaffEmail(
      'tenant-1',
      'user-1',
      'novo@nino.delivery'
    )

    // Assert
    expect(apiMock.patch).toHaveBeenCalledWith(
      'tenants/tenant-1/staff/user-1/email',
      { email: 'novo@nino.delivery' }
    )
  })

  it('removeStaff: removes the staff member by id', async () => {
    // Arrange / Act
    await StaffService.removeStaff('tenant-1', 'user-1')

    // Assert
    expect(apiMock.remove).toHaveBeenCalledWith(
      'tenants/tenant-1/staff/user-1'
    )
  })

  it('propagates the error when the request fails', async () => {
    // Arrange
    apiMock.get.mockRejectedValueOnce(new Error('network error'))

    // Act / Assert
    await expect(StaffService.listStaff('tenant-1')).rejects.toThrow(
      'network error'
    )
  })
})
