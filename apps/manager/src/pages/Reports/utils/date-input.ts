/**
 * Conversões entre `Date` e o `YYYY-MM-DD` dos campos de data. É formato de
 * formulário, não recorte de relatório: quem traduz dia em instante é a API,
 * no fuso da loja.
 */

/** Hoje em `YYYY-MM-DD` local, para limitar os campos a não-futuro. */
export const todayInput = (): string => dateToInput(new Date())

/** `YYYY-MM-DD` para `Date` na meia-noite local, como o campo espera. */
export const parseInputDate = (day: string): Date => new Date(`${day}T00:00:00`)

/** `Date` para `YYYY-MM-DD` local, inverso do `parseInputDate`. */
export const dateToInput = (date: Date): string =>
  date.toLocaleDateString('sv-SE')
