import { createContext } from 'react'
import { Functions } from 'firebase/functions'

export interface FunctionsState {
  functions?: Functions
}

const functionsContext = createContext<FunctionsState>({})

export default functionsContext
