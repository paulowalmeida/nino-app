export const tenantIdMock = 'tenant-1'
export const openingHoursIdMock = 'opening-hours-1'

export const openingHoursPageMock = {
  data: [
    {
      id: openingHoursIdMock,
      dayOfWeek: 1,
      openTime: '08:00',
      closeTime: '18:00',
      isOpen: true,
    },
  ],
  pagination: { total: 1 },
}

export const openingHoursMock = {
  id: openingHoursIdMock,
  dayOfWeek: 1,
  openTime: '08:00',
  closeTime: '18:00',
  isOpen: true,
}

export const createOpeningHoursRequestMock = {
  dayOfWeek: 1,
  openTime: '08:00',
  closeTime: '18:00',
  isOpen: true,
}

export const updateOpeningHoursRequestMock = { closeTime: '19:00' }

export const removeOpeningHoursMessageMock = {
  message: 'Horário removido.',
}
