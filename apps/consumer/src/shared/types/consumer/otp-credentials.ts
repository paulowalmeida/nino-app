/** Telefone ou e-mail, nunca os dois — a API recusa o corpo ambíguo. */
export type OtpCredentials = { phone?: string; email?: string }
