/** Um grupo de controles do estúdio, como a árvore da esquerda o lista. */
export type StudioGroup = {
  id:
    | 'themes'
    | 'colors'
    | 'assets'
    | 'catalog'
    | 'loading'
    | 'tracking'
    | 'versions'
  label: string
}
