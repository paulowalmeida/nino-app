import type { StudioToolbarProps } from './StudioToolbar'

export const studioToolbarPropsMock: Omit<
  StudioToolbarProps,
  'onDeviceChange' | 'onSave' | 'onPublish' | 'onDiscard'
> = {
  device: 'mobile',
  publishedVersion: 4,
  isDirty: false,
  hasUnpublishedDraft: false,
  isSaving: false,
  isPublishing: false,
}
