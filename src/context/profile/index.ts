import { createContext } from 'react'
import { Profile } from '../../types'

const profileContext = createContext<Partial<Profile>>({})
export default profileContext
