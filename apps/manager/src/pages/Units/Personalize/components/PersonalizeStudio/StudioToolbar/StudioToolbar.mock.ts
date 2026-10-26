import type { StudioToolbarProps } from './StudioToolbar'

export const studioToolbarPropsMock: Omit<
  StudioToolbarProps,
  'onSave' | 'onPublish' | 'onDiscard'
> = {
  device: 'mobile',
  onDeviceChange: () => {},
  publishedVersion: 4,
  isDirty: false,
  hasUnpublishedDraft: false,
  isSaving: false,
  isPublishing: false,
}
