export const tabItemTotalMock = {
  plainItem: { quantity: 2, unitPrice: 18, modifiers: [] },
  itemWithModifiers: {
    quantity: 2,
    unitPrice: 10,
    modifiers: [
      {
        id: 'm-1',
        optionId: 'o-1',
        name: 'Bacon',
        quantity: 2,
        unitPrice: 1.5,
      },
    ],
  },
  noisyItem: { quantity: 3, unitPrice: 0.1, modifiers: [] },
}
