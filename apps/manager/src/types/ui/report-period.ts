/**
 * Presets do relatório. `fortnight` e `month` são janelas móveis contadas
 * para trás a partir de hoje, não mês do calendário.
 */
export type ReportPeriod = 'today' | 'week' | 'fortnight' | 'month'
