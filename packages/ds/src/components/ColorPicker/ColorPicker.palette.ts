/**
 * Catálogo de cores oferecido ao lojista para pintar a própria loja.
 *
 * São as tintas do Tailwind, mas guardadas como HEX e não como classe: a cor
 * do tenant é dado, escolhido em runtime e injetado em `--store-tint`, e
 * classe é decidida em build. Por isso o `restrict.css` pode continuar
 * apagando essas mesmas famílias do tema sem tirar nenhuma opção daqui.
 *
 * A escala vai inteira, de `50` a `950`: quem escolhe a cor da própria loja
 * quer o tom exato, e cortar as pontas tira justamente o pastel de padaria e
 * o quase-preto de hamburgueria.
 *
 * `anchor` é o degrau 500, o tom que representa a família no seletor de
 * matiz — a cor pela qual a pessoa reconhece "azul" antes de afinar o tom.
 *
 * As famílias vêm na ordem do círculo cromático, começando no laranja da
 * casa, e os cinzas fecham a lista: é a ordem em que o olho procura, não a
 * alfabética.
 *
 * Nenhum filtro por contraste — o laranja do próprio nino (`#FF6B00`) marca
 * 2.86:1 contra branco e seria barrado por um. Quem resolve legibilidade é a
 * tinta que assenta por cima, escolhida por `readableInk`.
 */
export type ColorFamily = {
  key: string
  name: string
  anchor: string
  tints: string[]
}

export const COLOR_PALETTE: ColorFamily[] = [
  {
    key: 'orange',
    name: 'Laranja',
    anchor: '#FF6900',
    tints: [
      '#FFF7ED', '#FFEDD4', '#FFD6A7', '#FFB86A',
      '#FF8904', '#FF6900', '#F54900', '#CA3500',
      '#9F2D00', '#7E2A0C', '#441306',
    ],
  },
  {
    key: 'amber',
    name: 'Âmbar',
    anchor: '#FE9A00',
    tints: [
      '#FFFBEB', '#FEF3C6', '#FEE685', '#FFD230',
      '#FFB900', '#FE9A00', '#E17100', '#BB4D00',
      '#973C00', '#7B3306', '#461901',
    ],
  },
  {
    key: 'yellow',
    name: 'Amarelo',
    anchor: '#F0B100',
    tints: [
      '#FEFCE8', '#FEF9C2', '#FFF085', '#FFDF20',
      '#FDC700', '#F0B100', '#D08700', '#A65F00',
      '#894B00', '#733E0A', '#432004',
    ],
  },
  {
    key: 'lime',
    name: 'Lima',
    anchor: '#7CCF00',
    tints: [
      '#F7FEE7', '#ECFCCA', '#D8F999', '#BBF451',
      '#9AE600', '#7CCF00', '#5EA500', '#497D00',
      '#3C6300', '#35530E', '#192E03',
    ],
  },
  {
    key: 'green',
    name: 'Verde',
    anchor: '#00C950',
    tints: [
      '#F0FDF4', '#DCFCE7', '#B9F8CF', '#7BF1A8',
      '#05DF72', '#00C950', '#00A63E', '#008236',
      '#016630', '#0D542B', '#032E15',
    ],
  },
  {
    key: 'emerald',
    name: 'Esmeralda',
    anchor: '#00BC7D',
    tints: [
      '#ECFDF5', '#D0FAE5', '#A4F4CF', '#5EE9B5',
      '#00D492', '#00BC7D', '#009966', '#007A55',
      '#006045', '#004F3B', '#002C22',
    ],
  },
  {
    key: 'teal',
    name: 'Verde-azulado',
    anchor: '#00BBA7',
    tints: [
      '#F0FDFA', '#CBFBF1', '#96F7E4', '#46ECD5',
      '#00D5BE', '#00BBA7', '#009689', '#00786F',
      '#005F5A', '#0B4F4A', '#022F2E',
    ],
  },
  {
    key: 'cyan',
    name: 'Ciano',
    anchor: '#00B8DB',
    tints: [
      '#ECFEFF', '#CEFAFE', '#A2F4FD', '#53EAFD',
      '#00D3F2', '#00B8DB', '#0092B8', '#007595',
      '#005F78', '#104E64', '#053345',
    ],
  },
  {
    key: 'sky',
    name: 'Azul-céu',
    anchor: '#00A6F4',
    tints: [
      '#F0F9FF', '#DFF2FE', '#B8E6FE', '#74D4FF',
      '#00BCFF', '#00A6F4', '#0084D1', '#0069A8',
      '#00598A', '#024A70', '#052F4A',
    ],
  },
  {
    key: 'blue',
    name: 'Azul',
    anchor: '#2B7FFF',
    tints: [
      '#EFF6FF', '#DBEAFE', '#BEDBFF', '#8EC5FF',
      '#51A2FF', '#2B7FFF', '#155DFC', '#1447E6',
      '#193CB8', '#1C398E', '#162456',
    ],
  },
  {
    key: 'indigo',
    name: 'Índigo',
    anchor: '#615FFF',
    tints: [
      '#EEF2FF', '#E0E7FF', '#C6D2FF', '#A3B3FF',
      '#7C86FF', '#615FFF', '#4F39F6', '#432DD7',
      '#372AAC', '#312C85', '#1E1A4D',
    ],
  },
  {
    key: 'violet',
    name: 'Violeta',
    anchor: '#8E51FF',
    tints: [
      '#F5F3FF', '#EDE9FE', '#DDD6FF', '#C4B4FF',
      '#A684FF', '#8E51FF', '#7F22FE', '#7008E7',
      '#5D0EC0', '#4D179A', '#2F0D68',
    ],
  },
  {
    key: 'purple',
    name: 'Roxo',
    anchor: '#AD46FF',
    tints: [
      '#FAF5FF', '#F3E8FF', '#E9D4FF', '#DAB2FF',
      '#C27AFF', '#AD46FF', '#9810FA', '#8200DB',
      '#6E11B0', '#59168B', '#3C0366',
    ],
  },
  {
    key: 'fuchsia',
    name: 'Magenta',
    anchor: '#E12AFB',
    tints: [
      '#FDF4FF', '#FAE8FF', '#F6CFFF', '#F4A8FF',
      '#ED6AFF', '#E12AFB', '#C800DE', '#A800B7',
      '#8A0194', '#721378', '#4B004F',
    ],
  },
  {
    key: 'pink',
    name: 'Rosa',
    anchor: '#F6339A',
    tints: [
      '#FDF2F8', '#FCE7F3', '#FCCEE8', '#FDA5D5',
      '#FB64B6', '#F6339A', '#E60076', '#C6005C',
      '#A3004C', '#861043', '#510424',
    ],
  },
  {
    key: 'rose',
    name: 'Rosé',
    anchor: '#FF2056',
    tints: [
      '#FFF1F2', '#FFE4E6', '#FFCCD3', '#FFA1AD',
      '#FF637E', '#FF2056', '#EC003F', '#C70036',
      '#A50036', '#8B0836', '#4D0218',
    ],
  },
  {
    key: 'red',
    name: 'Vermelho',
    anchor: '#FB2C36',
    tints: [
      '#FEF2F2', '#FFE2E2', '#FFC9C9', '#FFA2A2',
      '#FF6467', '#FB2C36', '#E7000B', '#C10007',
      '#9F0712', '#82181A', '#460809',
    ],
  },
  {
    key: 'stone',
    name: 'Pedra',
    anchor: '#79716B',
    tints: [
      '#FAFAF9', '#F5F5F4', '#E7E5E4', '#D6D3D1',
      '#A6A09B', '#79716B', '#57534D', '#44403B',
      '#292524', '#1C1917', '#0C0A09',
    ],
  },
  {
    key: 'neutral',
    name: 'Neutro',
    anchor: '#737373',
    tints: [
      '#FAFAFA', '#F5F5F5', '#E5E5E5', '#D4D4D4',
      '#A1A1A1', '#737373', '#525252', '#404040',
      '#262626', '#171717', '#0A0A0A',
    ],
  },
  {
    key: 'zinc',
    name: 'Zinco',
    anchor: '#71717B',
    tints: [
      '#FAFAFA', '#F4F4F5', '#E4E4E7', '#D4D4D8',
      '#9F9FA9', '#71717B', '#52525C', '#3F3F46',
      '#27272A', '#18181B', '#09090B',
    ],
  },
  {
    key: 'gray',
    name: 'Cinza',
    anchor: '#6A7282',
    tints: [
      '#F9FAFB', '#F3F4F6', '#E5E7EB', '#D1D5DC',
      '#99A1AF', '#6A7282', '#4A5565', '#364153',
      '#1E2939', '#101828', '#030712',
    ],
  },
  {
    key: 'slate',
    name: 'Ardósia',
    anchor: '#62748E',
    tints: [
      '#F8FAFC', '#F1F5F9', '#E2E8F0', '#CAD5E2',
      '#90A1B9', '#62748E', '#45556C', '#314158',
      '#1D293D', '#0F172B', '#020618',
    ],
  },
]
