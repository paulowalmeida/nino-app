export type GoogleCredentialResponse = { credential?: string }

export type GoogleButtonOptions = {
  type: 'standard'
  theme: 'outline' | 'filled_white' | 'filled_blue'
  size: 'large' | 'medium' | 'small'
  shape: 'rectangular' | 'pill'
  text: 'signin_with' | 'continue_with'
  logo_alignment: 'left' | 'center'
  width: number
  locale: string
}

export type GoogleIdentityApi = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string
        callback: (response: GoogleCredentialResponse) => void
        cancel_on_tap_outside?: boolean
        use_fedcm_for_prompt?: boolean
      }) => void
      renderButton: (parent: HTMLElement, options: GoogleButtonOptions) => void
      disableAutoSelect: () => void
    }
  }
}
