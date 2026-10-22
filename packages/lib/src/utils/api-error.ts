export class ApiError extends Error {
  readonly status: number
  // WHY: o chamador às vezes precisa do `code` ou de um dado extra do corpo.
  readonly body: unknown

  constructor(status: number, message: string, body?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}
