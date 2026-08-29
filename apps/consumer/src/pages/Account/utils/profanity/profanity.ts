// CONSTRAINT: a mesma checagem existe na API (`profanity.validator.ts`) —
// esta é a primeira porta, não a única; o front avisa antes de enviar, o
// back recusa de novo.
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

// WHY: letra dobrada e triplicada chegam ao mesmo esqueleto de propósito —
// é assim que "burrraa" cai na mesma checagem de "burra".
export const normalizeForProfanity = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[013457@$]/g, (char) => LEET[char] ?? char)
    .replace(/[^a-z]+/g, ' ')
    .replace(/(.)\1+/g, '$1')
    .trim()

// WORKAROUND: base64 de propósito — ninguém precisa ler xingamento ao abrir
// o arquivo ou revisar um diff (não é ofuscação de segurança, o bundle é
// público). Editar só via `cd nino-api && npm run profanity -- add <termo>
// [--exact]`, que mantém os dois repositórios em sincronia. SUBSTRING casa
// em qualquer posição (radical de uma família inteira); EXACT só vale como
// palavra inteira (termos curtos que existem dentro de palavra legítima).
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

export const hasProfanity = (value: string): boolean => {
  const normalized = normalizeForProfanity(value)
  if (!normalized) return false

  const words = normalized.split(' ')
  if (words.some((word) => EXACT_TERMS.has(word))) return true

  const squished = words.join('')
  return SUBSTRING_TERMS.some((term) => squished.includes(term))
}
