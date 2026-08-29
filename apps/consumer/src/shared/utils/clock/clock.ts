const hhmm = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

/**
 * `18h42` — a hora como a loja escreve no WhatsApp, não `18:42`. A previsão
 * é sempre de hoje: ninguém espera o jantar para outro dia, então a data só
 * roubaria espaço do número que importa.
 */
export const clockLabel = (iso: string): string =>
  hhmm.format(new Date(iso)).replace(':', 'h')
