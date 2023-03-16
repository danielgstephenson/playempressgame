import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { writeContext } from './context'
import { WriteState, WritingProps, WriterProps } from './types'

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
