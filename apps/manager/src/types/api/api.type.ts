export type ApiFactoryType = {
  getAll: <
    ParamsType extends Record<string, string | number | boolean>,
    ReturnType,
  >(
    url: string,
    params: ParamsType
  ) => Promise<ReturnType>
  get: <ReturnType>(url: string, id?: string | number) => Promise<ReturnType>
  create: <BodyType, ReturnType>(
    url: string,
    body: BodyType
  ) => Promise<ReturnType>
  update: <BodyType, ReturnType>(
    url: string,
    id: string | number,
    body: BodyType
  ) => Promise<ReturnType>
  patch: <BodyType, ReturnType>(
    url: string,
    id: string | number,
    body: BodyType
  ) => Promise<ReturnType>
  remove: <ReturnType>(url: string, id: string | number) => Promise<ReturnType>
}
