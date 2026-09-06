import type { SignInChannel } from '@pages/sign-in/types/SignInChannel.type'

export const SIGN_IN_CHANNELS: { id: SignInChannel; label: string }[] = [
  { id: 'phone', label: 'Telefone' },
  { id: 'email', label: 'E-mail' },
]

/*
 * O `hl` na URL é o que traduz o botão. A opção `locale` do renderButton é
 * ignorada quando o script já subiu em outro idioma: quem decide a língua do
 * widget é o carregamento do SDK.
 */
export const GOOGLE_SDK_SRC = 'https://accounts.google.com/gsi/client?hl=pt-BR'

export const GOOGLE_BUTTON = {
  type: 'standard',
  theme: 'outline',
  size: 'large',
  shape: 'pill',
  text: 'signin_with',
  logo_alignment: 'left',
  width: 320,
  locale: 'pt-BR',
} as const

/* o widget do Google não passa de 400px; acima disso ele ignora e corta */
export const GOOGLE_BUTTON_MAX_WIDTH = 400
