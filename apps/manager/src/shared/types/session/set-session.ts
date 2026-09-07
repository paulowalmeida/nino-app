import type { SessionState } from '@shared/types/session/session-state'

export type SetSession = (partial: Partial<SessionState>) => void
