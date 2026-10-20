export const useReportsFacadeMock = {
  period: 'today',
  setPeriod: () => undefined,
  custom: { from: '', to: '', awaitingDates: false },
  report: { report: undefined, isPending: false, isError: false },
  timing: { report: undefined, isPending: false },
  series: {
    channel: { breakdown: [], isPending: false },
    payment: { breakdown: [], isPending: false },
  },
  breakdown: { channel: [], payment: [] },
  unitId: null,
  labels: { channel: {}, payment: {} },
}
