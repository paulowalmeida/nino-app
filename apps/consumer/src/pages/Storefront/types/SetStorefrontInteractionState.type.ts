import type { StoreApi } from 'zustand'
import type { StorefrontInteractionState } from './StorefrontInteractionState.type'

export type SetStorefrontInteractionState =
  StoreApi<StorefrontInteractionState>['setState']
