import type { PublicOpeningHours } from '@custom_types/opening-hours/public-opening-hours'

export const useOpeningHoursMock: { hours: PublicOpeningHours[] } = {
  hours: [
    { dayOfWeek: 1, openTime: '09:00', closeTime: '18:00', isOpen: true },
  ],
}
