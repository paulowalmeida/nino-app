import { InputHTMLAttributes, Ref } from 'react'

export type InputSize = 'sm' | 'md' | 'lg'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: InputSize
  error?: boolean
  ref?: Ref<HTMLInputElement>
}
