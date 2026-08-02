/**
 * O nome do freguês vai para a comanda, o balcão e as telas do painel — é
 * texto que a cozinha lê em voz alta. Aqui só barramos o óbvio: xingamento,
 * termo sexual e slur, inclusive escritos com número no lugar de letra,
 * letra repetida ou separador no meio.
 *
 * A mesma checagem existe na API (`profanity.validator.ts`) — esta é a
 * primeira porta, não a única: o front avisa antes de enviar, o back recusa.
 */

const LEET: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '@': 'a',
  $: 's',
}

/**
 * Reduz o texto ao esqueleto comparável: sem acento, sem leet, sem símbolo e
 * sem letra repetida (letra dobrada e triplicada chegam ao mesmo esqueleto).
 */
export const normalizeForProfanity = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[013457@$]/g, (char) => LEET[char] ?? char)
    .replace(/[^a-z]+/g, ' ')
    .replace(/(.)\1+/g, '$1')
    .trim()

/*
 * As duas listas vão em base64 de propósito: ninguém precisa ler xingamento
 * ao abrir o arquivo ou revisar um diff — e não é ofuscação de segurança, o
 * bundle é público. Para editar, use o script, nunca a mão:
 *
 *   cd nino-api && npm run profanity -- add <termo> [--exact]
 *
 * Ele mantém os dois repositórios em sincronia.
 *
 * SUBSTRING: termos procurados em qualquer posição, para pegar também o nome
 * escrito tudo colado. Guardados como radical quando a família toda ofende.
 * EXACT: termos curtos ou que existem dentro de palavra legítima — só valem
 * como palavra inteira.
 */
const SUBSTRING_B64 = [
  'YWlkZXRpY28sYWxlaWphZG8sYXJyb21iYWQsYXNzYXNzaW5vLGFzc2hvbGUsYmFiYWNh',
  'LGJhaXRvbGEsYmFuZGlkbyxiYXN0YXJkLGJpY2hvbmEsYmlzY2F0ZSxiaXRjaCxib2Nl',
  'dCxib2lvbGEsYm9xdWV0ZSxib3F1ZXRlaXJhLGJvc3RhLGJ1Y2V0LGJ1bmRhLGJ1bmR1',
  'ZGEsY2FjZXRhLGNhY2V0ZSxjYWdhZGEsY2FnYWxoYW8sY2FnYW5kbyxjYWdhbyxjYWdh',
  'cixjYXJhbGgsY2hpZnJ1ZG8sY2hvY2hvdGEsY2h1cGEsY2xpdG9yaXMsY29saGFvLGNv',
  'bGhvZXMsY29ybm8sY29ybnVkbyxjcmlvdWwsY3VudCxjdXphbyxjdXppbmhvLGRlYmls',
  'b2lkZSxkZXByYXZhZG8sZGVzZ3JhYyxlc2Nyb3QsZXNwb3JyYWRhLGVzdHVwaWQsZXN0',
  'dXByYWRvcixmYWdnb3QsZmF2ZWxhZG8sZmVkaWRvLGZpbGhhZGFwdXRhLGZpbGhhZGVw',
  'dXRhLGZpbGhvZGFwdXRhLGZpbGhvZGVwdXRhLGZvZGFzZSxmb2Rlcixmb2RpZG8sZnVj',
  'ayxmdWRlcixmdWRpZG8sZ2Vub2NpZGEsZ296YWRhLGdvemFuZG8saGl0bGVyLGlkaW90',
  'YSxpbWJlY2lsLGthcmFsaCxsYWRyYW8sbWFjYWNhLG1hY2FjbyxtYWNvbmhlaXJvLG1h',
  'c3R1cmIsbWVyZGEsbWlqYWRhLG1pamFvLG1vbmdvbG9pZGUsbmF6aXN0YSxub2plbnRv',
  'LG9yZ2lhLG90YXJpLHBhbmFjYSxwYXV6dWRvLHBlZG9maWwscGVpZG8scGVpZG9ycmVp',
  'cm8scGVpdHVkLHBlbmlzLHBlbnRlbGhvLHBlcGVjYSxwZXJlcmVjYSxwZXJ2ZXJ0aWRv',
  'LHBpcmFuaGEscGlyb2MscG9wb3p1ZGEscG9yY2FyaWEscG9ycmEscHJpcXVpdG8scHJv',
  'c3RpdHV0LHB1bmhldCxwdXNzeSxwdXRhcXVlb3Bhcml1LHB1dGFyaWEscHV0aW5oYSxw',
  'dXRvbmEscmFidWQscmFjaXN0YSxyZXRhcmQscmV0YXJkYWQsc2FjYW5hZ2VtLHNhZmFk',
  'LHNhcGF0YW8sc2FwYXRvbmEsc2Vmb2RlcixzaXJpcmljYSxzbHV0LHN1cnViYSx0YXJh',
  'ZGEsdGFyYWRvLHRlc2FvLHRlc3RpY3Vsbyx0b21hbm9jdSx0cmF2ZWNvLHZhZGlhLHZh',
  'Z2FidW5kLHZhZ2luYSx2YWl0b21hcix2ZWFkbyx2aWFkYW8sdmlhZGluaG8sdmlhZG8s',
  'd2Fua2VyLHdob3JlLHhlcmVjYSx4aWJpdSx4b3RhLHhveG90YQ==',
].join('')

const EXACT_B64 = [
  'Y3Usa3UsZmRwLHBxcCx2c2YsdnRuYyx0bmMscG5jLGtybCxjcmwsY3JsaCxwcnIsbXJk',
  'LGNsbixwcGssYmN0LHBvaGEscHV0YSxwdXRvLGZvZGEsYmljaGEscGljYSxwYXUscm9s',
  'YSxqZWJhLHRvYmEsZmlvZm8sYnVjYSxjYWdhLGNhZ291LG1pamEsbWlqbyxsaXhvLGFu',
  'YWwsYW51cyxzZXhvLHhhbmEsbmF6aSxuaWdhLG5pZ2VyLGNvY2ssc2hpdCxkaWNr',
].join('')

const decode = (value: string): string[] =>
  atob(value).split(',')

const SUBSTRING_TERMS = decode(SUBSTRING_B64).map(normalizeForProfanity)

const EXACT_TERMS = new Set(decode(EXACT_B64).map(normalizeForProfanity))

/** `true` quando o texto carrega palavrão, xingamento ou slur. */
export const hasProfanity = (value: string): boolean => {
  const normalized = normalizeForProfanity(value)
  if (!normalized) return false

  const words = normalized.split(' ')
  if (words.some((word) => EXACT_TERMS.has(word))) return true

  const squished = words.join('')
  return SUBSTRING_TERMS.some((term) => squished.includes(term))
}
