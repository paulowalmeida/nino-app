import { useHasPermission } from '@shared/hooks/session/useHasPermission/useHasPermission'

export const useTabPermissions = () => ({
  canCancelTab: useHasPermission('tabs.cancel'),
})
