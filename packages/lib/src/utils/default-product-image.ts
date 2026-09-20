const PRESETS: readonly [RegExp, string][] = [
  [/\bx[-\s]?salada\b/i, '/product-presets/x-salada.png'],
  [/\bx[-\s]?bacon\b/i, '/product-presets/x-bacon.png'],
  [/\bx[-\s]?tudo\b/i, '/product-presets/x-tudo.png'],
  [/\bx[-\s]?egg\b/i, '/product-presets/x-egg.png'],
  [/\bx[-\s]?calabresa\b/i, '/product-presets/x-calabresa.png'],
  [/\bx[-\s]?frango\b/i, '/product-presets/x-frango.png'],
  [/\bx[-\s]?costela\b/i, '/product-presets/x-costela.png'],
  [/\bhamb[uú]rguer\s+simples\b/i, '/product-presets/hamburguer-simples.png'],
  [/\bduplo\s+cheddar\b/i, '/product-presets/duplo-cheddar.png'],
  [/\bsmash\s+cl[aá]ssico\b/i, '/product-presets/smash-classico.png'],
  [/\bsmash\s+duplo\b/i, '/product-presets/smash-duplo.png'],
  [/\bveggie\s+burger\b/i, '/product-presets/veggie-burger.png'],
  [
    /\bbatata\s+com\s+cheddar\s+e\s+bacon\b/i,
    '/product-presets/batata-cheddar-bacon.png',
  ],
  [/\bonion\s+rings\b/i, '/product-presets/onion-rings.png'],
  [/\bfrango\s+a\s+passarinho\b/i, '/product-presets/frango-a-passarinho.png'],
  [/\bcalabresa\s+acebolada\b/i, '/product-presets/calabresa-acebolada.png'],
  [/\bmandioca\s+frita\b/i, '/product-presets/mandioca-frita.png'],
  [/\bnuggets\b/i, '/product-presets/nuggets.png'],
  [/\bpizza\s+margherita\b/i, '/product-presets/pizza-margherita.png'],
  [/\bpizza\s+calabresa\b/i, '/product-presets/pizza-calabresa.png'],
  [/\bpizza\s+portuguesa\b/i, '/product-presets/pizza-portuguesa.png'],
  [
    /\bpizza\s+quatro\s+queijos\b/i,
    '/product-presets/pizza-quatro-queijos.png',
  ],
  [
    /\bpizza\s+frango\s+com\s+catupiry\b/i,
    '/product-presets/pizza-frango-catupiry.png',
  ],
  [/\bpizza\s+pepperoni\b/i, '/product-presets/pizza-pepperoni.png'],
  [/\bbatata\s+frita\b/i, '/product-presets/batata-frita.png'],
]

/** Imagens locais exibidas quando um item conhecido ainda não tem foto própria. */
export const defaultProductImage = (name: string): string | null =>
  PRESETS.find(([pattern]) => pattern.test(name))?.[1] ?? null
