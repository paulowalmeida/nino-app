import { expect, it } from 'vitest'

import { primaryImage } from './menu-image'

it.each([
  ['Batata Frita P', '/product-presets/batata-frita.png'],
  ['X-Salada', '/product-presets/x-salada.png'],
  ['X-Bacon', '/product-presets/x-bacon.png'],
  ['X-Tudo', '/product-presets/x-tudo.png'],
  ['X-Egg', '/product-presets/x-egg.png'],
  ['X-Calabresa', '/product-presets/x-calabresa.png'],
  ['X-Frango', '/product-presets/x-frango.png'],
  ['X-Costela', '/product-presets/x-costela.png'],
  ['Hambúrguer Simples', '/product-presets/hamburguer-simples.png'],
  ['Duplo Cheddar', '/product-presets/duplo-cheddar.png'],
  ['Smash Clássico', '/product-presets/smash-classico.png'],
  ['Smash Duplo', '/product-presets/smash-duplo.png'],
  ['Veggie Burger', '/product-presets/veggie-burger.png'],
  ['Batata com Cheddar e Bacon', '/product-presets/batata-cheddar-bacon.png'],
  ['Onion Rings', '/product-presets/onion-rings.png'],
  ['Frango a Passarinho', '/product-presets/frango-a-passarinho.png'],
  ['Calabresa Acebolada', '/product-presets/calabresa-acebolada.png'],
  ['Mandioca Frita', '/product-presets/mandioca-frita.png'],
  ['Nuggets (10 un)', '/product-presets/nuggets.png'],
  ['Pizza Margherita', '/product-presets/pizza-margherita.png'],
  ['Pizza Calabresa', '/product-presets/pizza-calabresa.png'],
  ['Pizza Portuguesa', '/product-presets/pizza-portuguesa.png'],
  ['Pizza Quatro Queijos', '/product-presets/pizza-quatro-queijos.png'],
  ['Pizza Frango com Catupiry', '/product-presets/pizza-frango-catupiry.png'],
  ['Pizza Pepperoni', '/product-presets/pizza-pepperoni.png'],
])('uses the preset for %s without images', (name, image) =>
  expect(primaryImage({ name, images: [] } as never)).toBe(image)
)

it('returns null for an unknown item without images', () =>
  expect(
    primaryImage({ name: 'Produto sem foto', images: [] } as never)
  ).toBeNull())
