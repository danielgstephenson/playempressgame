import { Functions } from 'firebase/functions'
import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { FunctionCaller } from '../types'
import ActionView from './Action'

export default function CallerContentView ({
  label,
  functions,
  action,
  onCall
}: {
  label: string
  functions: Functions
  action: string
  onCall: (caller: FunctionCaller, data?: unknown) => Promise<void>
}): JSX.Element {
  const [callAction, actionLoading, actionError] = useHttpsCallable(functions, action)
  function handleClick (): void {
    void onCall(callAction)
  }
  return (
    <ActionView action={handleClick} loading={actionLoading} error={actionError} label={label} />
  )
}
