import { Functions } from 'firebase/functions'
import { ReactNode } from 'react'
import functionsContext, { FunctionsState } from '.'

export default function FunctionsProvider ({
  functions,
  children
}: {
  functions: Functions
  children: ReactNode
}): JSX.Element {
  const state: FunctionsState = { functions }

  return (
    <functionsContext.Provider value={state}>
      {children}
    </functionsContext.Provider>
  )
}
