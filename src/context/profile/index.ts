import { createContext } from 'react'
import { Profile } from '../../types'

export interface ProfileState {
  profile?: Profile
  gameId?: string
  userId?: string
}

const profileContext = createContext<ProfileState>({})
export default profileContext
