import { useContext } from 'react'
import functionsContext from '../context/functions'
import CallerContentView from './CallerContent'
import { FunctionCaller } from '../types'

async function apply (caller: FunctionCaller, data?: unknown): Promise<void> {
  void caller(data)
}

export default function CallerView ({
  action,
  label,
  onCall = apply
}: {
  action: string
  label: string
  onCall?: (caller: FunctionCaller) => Promise<void>
}): JSX.Element {
  const functionsState = useContext(functionsContext)
  if (functionsState.functions == null) {
    return <></>
  }
  return (
    <CallerContentView action={action} functions={functionsState.functions} label={label} onCall={onCall} />
  )
}
