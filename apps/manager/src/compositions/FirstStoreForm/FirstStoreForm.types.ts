export type FirstStoreFormValues = {
  customName: string
  slug: string
  typeId: string
  zipCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
}

export type FirstStoreFormProps = {
  /**
   * Chamado a cada tecla, com o rascunho inteiro. Serve a quem precisa
   * espelhar o que está sendo digitado — a placa da tela de unidades acende
   * com o nome antes de a loja existir.
   */
  onChange?: (values: Partial<FirstStoreFormValues>) => void
  /** Para onde ir depois de criar. Sem isto, volta para a raiz. */
  onCreated?: (store: { id: string; slug: string }) => string
  /**
   * Texto do botão. No cadastro inicial o objeto é a loja; dentro do painel,
   * quem já opera está abrindo mais uma unidade. Padrão: "Criar loja".
   */
  submitLabel?: string
}
