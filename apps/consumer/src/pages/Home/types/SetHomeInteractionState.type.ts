import type { StoreApi } from 'zustand'
import type { HomeInteractionState } from './HomeInteractionState.type'

export type SetHomeInteractionState = StoreApi<HomeInteractionState>['setState']
