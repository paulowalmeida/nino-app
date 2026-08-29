// WHY: fixtures ficam em base64, no mesmo espírito do arquivo que testam —
// ninguém precisa ler xingamento ao abrir este arquivo ou revisar um diff.
export const profanityMock = {
  cleanName: atob('TWFyaWEgU2lsdmE='),
  exactTermB64: 'cHV0YQ==',
  leetSubstringTermB64: 'cDBycjQ=',
}
