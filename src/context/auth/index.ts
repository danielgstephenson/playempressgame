import { createContext } from 'react'
import { AuthState } from '../../types'

const authContext = createContext<AuthState>({})
export default authContext
