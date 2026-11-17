/** Campo de código digitado, para quem aplica cupons por código. */
export type CouponCodeForm = {
  onSubmit: (code: string) => void
  isLoading: boolean
  error?: string
}
