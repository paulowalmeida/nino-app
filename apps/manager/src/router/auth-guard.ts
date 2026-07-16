import { ApiFactory } from '@services/api/api.service'
import { redirect } from 'react-router'

export const AuthGuard = async () => {
  const { get } = ApiFactory()

  try {
    return await get('/auth/me')
  } catch {
    return redirect('/entrar')
  }
}
