import { SVGAttributes } from 'react'

/* `values` é omitido do SVG de propósito: o atributo nativo existe para
 * animação (`<animate values="...">`) e é `string`, o que colidiria com a
 * série numérica. */
export type SparklineProps = Omit<
  SVGAttributes<SVGSVGElement>,
  'children' | 'values'
> & {
  /** Série na ordem do tempo. Menos de dois pontos não desenha nada. */
  values: number[]
  /**
   * O que a linha mostra, para quem não a enxerga. Vira o nome acessível do
   * gráfico — sem isso ele fica escondido de leitor de tela.
   */
  label: string
  /** Altura em px. A largura acompanha o contêiner. Default: `32` */
  height?: number
  /** Marca o último ponto com um disco. Default: `true` */
  showLastPoint?: boolean
}
