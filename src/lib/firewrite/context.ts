import { createContext } from 'react'
import { WriteState } from './types'

export const writeContext = createContext<WriteState>({})
