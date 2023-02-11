import { createContext } from 'react'
import { Auth, User } from 'firebase/auth'

interface AuthState {
  auth?: Auth
  user?: User | null
}

const authContext = createContext<AuthState>({})
export default authContext
