import type { ColorFieldProps } from './ColorField'

export const colorFieldMock: Omit<ColorFieldProps, 'onValueChange'> = {
  label: 'Cor primária',
  hint: 'Botões, preços e destaques',
  value: '#ff6b00',
}
