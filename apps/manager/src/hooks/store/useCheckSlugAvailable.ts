import { useCallback } from 'react'

import { TenantService } from '@services/tenant.service'

export const SLUG_TAKEN_MESSAGE = 'Este endereço já está em uso'

/**
 * The check is a courtesy: the unique constraint is what actually decides,
 * and the submit surfaces it as a 409. So a throttled or offline lookup lets
 * the form through instead of blocking on an answer we could not get.
 */
export const useCheckSlugAvailable = () =>
  useCallback(async (slug: string): Promise<true | string> => {
    try {
      const { available } = await TenantService.checkSlug(slug)
      return available || SLUG_TAKEN_MESSAGE
    } catch {
      return true
    }
  }, [])
