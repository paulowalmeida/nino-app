export const productHeroMock = {
  slug: 'burgao-centro',
  product: {
    id: '0eeb0fda-77ca-51a4-a00e-64fbc08e4675',
    name: 'X-Salada',
    images: [] as { id: string; url: string }[],
    fallbackUrl: null,
  },
}

export const productHeroWithImageMock = {
  ...productHeroMock,
  product: {
    ...productHeroMock.product,
    images: [{ id: 'img-1', url: 'https://cdn.nino.test/x-salada.jpg' }],
  },
}
