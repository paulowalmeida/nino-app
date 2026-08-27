/**
 * Emoji por palavra-chave no nome do produto — cosmético, não crítico.
 * Sem match, cai no glifo padrão do chamador.
 */
const KEYWORD_ICON: [RegExp, string][] = [
  // lanches
  [/x-|cheeseburger|hamb[uú]rguer|burg|sandu[ií]che/i, '🍔'],
  [/hot ?dog|cachorro.?quente/i, '🌭'],
  [/wrap|enrolad/i, '🌯'],
  [/taco|burrito|nacho|quesadilla/i, '🌮'],
  [/kebab|esfiha|kibe|árabe|arabe|shawarma/i, '🥙'],

  // pizza e massas
  [/pizza/i, '🍕'],
  [/lasanha/i, '🍝'],
  [/massa|macarr[ãa]o|espaguete|nhoque|ravioli/i, '🍝'],
  [/risoto/i, '🍚'],

  // frango, carnes, peixes
  [/frango|galeto|asa|coxinha da asa/i, '🍗'],
  [/costela|churrasco|espeto|picanha|carne|bife|steak/i, '🥩'],
  [/linguiça|salsicha/i, '🌭'],
  [/peixe|salm[ãa]o|bacalhau|tilápia/i, '🐟'],
  [/camar[ãa]o|frutos do mar|lula|polvo/i, '🦐'],
  [/sushi|sashimi|temaki|hot ?roll|japon[êe]s/i, '🍣'],

  // salgados e porções
  [/coxinha|salgad|pastel|kibe|risole|bolinho/i, '🥟'],
  [/batata frita|fritas/i, '🍟'],
  [/onion ring|anel de cebola/i, '🧅'],
  [/nugget|isca/i, '🍤'],
  [/queijo|provolone/i, '🧀'],
  [/p[ãa]o de alho/i, '🥖'],

  // saladas e vegetariano
  [/salada/i, '🥗'],
  [/vegan|vegetarian|veggie/i, '🥦'],
  [/legum|verdura/i, '🥬'],

  // sopas e pratos
  [/sopa|caldo|canja/i, '🍲'],
  [/feijoada/i, '🍛'],
  [/marmita|prato feito|self.?service|executivo/i, '🍱'],
  [/bowl|poke/i, '🥙'],

  // padaria e café da manhã
  [/caf[eé]|padaria|p[ãa]o(?!\s*de\s*alho)|croissant/i, '🥐'],
  [/tapioca|crepe/i, '🫓'],
  [/ovo|omelete/i, '🍳'],
  [/waffle|panqueca/i, '🧇'],

  // doces e sobremesas
  [/sorvete|milkshake|a[çc]a[íi]/i, '🍨'],
  [/bolo|cupcake/i, '🍰'],
  [/torta/i, '🥧'],
  [/brigadeiro|chocolate|trufa|brownie/i, '🍫'],
  [/cookie|biscoito/i, '🍪'],
  [/donut|rosquinha/i, '🍩'],
  [/pudim|mousse|sobremesa|doce/i, '🍮'],
  [/fruta|frutas/i, '🍓'],

  // bebidas
  [/refrigerante|refri|coca|guaran[áa]|soda/i, '🥤'],
  [/suco|vitamina/i, '🧃'],
  [/[áa]gua/i, '💧'],
  [/cerveja|chopp|beer/i, '🍺'],
  [/vinho|wine/i, '🍷'],
  [/drink|coquetel|caipirinha|gin/i, '🍹'],
  [/energ[eé]tico/i, '⚡'],
  [/ch[áa](?!\s*mado)/i, '🍵'],
  [/bebid/i, '🥤'],
]

export const toCategoryIcon = (name: string): string | null =>
  KEYWORD_ICON.find(([pattern]) => pattern.test(name))?.[1] ?? null
