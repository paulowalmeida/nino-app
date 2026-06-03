export type TagsInputSize = 'sm' | 'md' | 'lg'

export interface TagsInputProps {
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  /** Maximum number of tags */
  max?: number
  disabled?: boolean
  error?: boolean
  size?: TagsInputSize
  className?: string
}
