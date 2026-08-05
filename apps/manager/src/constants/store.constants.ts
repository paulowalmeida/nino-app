import type { UnitDraft } from '@compositions/UnitCard/UnitCard'

/** Time zones covering Brazil — the store operates in one, not any of
    them. */
export const UNIT_TIMEZONES = [
  { value: 'America/Sao_Paulo', label: 'Brasília (GMT-3)' },
  { value: 'America/Belem', label: 'Belém (GMT-3)' },
  { value: 'America/Fortaleza', label: 'Fortaleza (GMT-3)' },
  { value: 'America/Manaus', label: 'Manaus (GMT-4)' },
  { value: 'America/Cuiaba', label: 'Cuiabá (GMT-4)' },
  { value: 'America/Porto_Velho', label: 'Porto Velho (GMT-4)' },
  { value: 'America/Rio_Branco', label: 'Rio Branco (GMT-5)' },
  { value: 'America/Noronha', label: 'Fernando de Noronha (GMT-2)' },
]

export const EMPTY_UNIT_DRAFT: UnitDraft = {
  customName: '',
  timezone: 'America/Sao_Paulo',
  primaryColor: '#FF6B00',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
}

export const PAUSE_DURATION_OPTIONS = [
  { minutes: 30, label: '30 min' },
  { minutes: 60, label: '1 hora' },
  { minutes: 180, label: '3 horas' },
  { minutes: undefined, label: 'Até eu reabrir' },
]

/**
 * O que a pessoa precisa saber antes de abrir, e não depois. Não é lista de
 * passos — são dois fatos paralelos —, então nada de numeração: fio fino
 * separando, como nos outros blocos do painel.
 */
export const NEW_UNIT_FACTS = [
  {
    strong: 'Cardápio, horário e zonas',
    rest: ' são só desta unidade. Nada vem copiado das outras.',
  },
  {
    strong: 'Equipe e assinatura',
    rest: ' continuam da empresa — quem já trabalha com você entra aqui também.',
  },
  {
    strong: 'O link',
    rest: ' é o endereço que seus clientes vão acessar. Depois de criado, mudar quebra o que já foi divulgado.',
  },
]
