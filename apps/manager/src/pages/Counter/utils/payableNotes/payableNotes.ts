import {
  CASH_NOTES,
  CASH_SUGGESTION_LIMIT,
} from '@pages/Counter/constants/counter.constants'

/*
 * WHY: só a cédula que cobre o total ajuda — oferecer R$ 5 numa venda de R$ 47
 * gasta o espaço do balcão com um botão que ninguém pode apertar. A nota exata
 * também sai: quem paga certo usa o atalho "valor exato".
 */
export const payableNotes = (total: number): number[] =>
  CASH_NOTES.filter((note) => note > total).slice(0, CASH_SUGGESTION_LIMIT)
