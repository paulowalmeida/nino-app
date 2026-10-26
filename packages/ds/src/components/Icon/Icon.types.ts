import { IconName } from './Icon.names'

export type { IconName }

/* A escala vai abaixo do 16px porque o selo pede: dentro de um quadrado de
   24px, um ícone de 16px encosta nas bordas. */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
