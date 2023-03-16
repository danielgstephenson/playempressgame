import { Functions, HttpsCallableResult } from 'firebase/functions'
import { createContext, FC } from 'react'
import { useHttpsCallable } from 'react-firebase-hooks/functions'

export type CloudCaller = <Props> (props?: Props) => Promise<HttpsCallableResult<unknown> | undefined>

interface WriteProps <Props extends {}> {
  fn: string
  label: string
  onCall?: (caller: CloudCaller, props: Props) => Promise<void>
  props?: Props
  WriteView: FC
}

interface WritingProps <Props extends {}> extends WriteProps<Props> {
  functions: Functions
}

interface WriterProps <Props extends {}> extends WriteProps<Props> {
  functions?: Functions
}

interface WriteState {
  write?: () => Promise<void>
  loading?: boolean
  error?: Error | undefined
  label?: string
}

export const writeContext = createContext<WriteState>({})

function Writing <Props extends {}> ({
  fn,
  WriteView,
  label,
  onCall,
  functions,
  props
}: WritingProps<Props>): JSX.Element {
  const [cloudFunction, loading, error] = useHttpsCallable(functions, fn)
  async function write (): Promise<void> {
    if (onCall == null) {
      await cloudFunction(props)
    } else {
      const realProps = props == null ? {} : props
      const fakeProps = realProps as Props
      await onCall(cloudFunction, fakeProps)
    }
  }
  const writeState: WriteState = {
    write,
    loading,
    error,
    label
  }
  return (
    <writeContext.Provider value={writeState}>
      <WriteView />
    </writeContext.Provider>
  )
}

export default function Writer <Props extends {}> ({
  fn,
  label,
  onCall,
  functions,
  props,
  WriteView
}: WriterProps<Props>): JSX.Element {
  if (functions == null) {
    return <></>
  }
  return (
    <Writing
      fn={fn}
      WriteView={WriteView}
      label={label}
      onCall={onCall}
      functions={functions}
      props={props}
    />
  )
}
