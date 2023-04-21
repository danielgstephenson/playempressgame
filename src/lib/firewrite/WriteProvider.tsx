import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { writeContext } from './context'
import { WriteProviderProps, WriteState } from './types'

export default function WriteProvider <Props extends {}> ({
  fn,
  WriteConsumer,
  label,
  onCall,
  functions,
  props,
  ...viewProps
}: WriteProviderProps<Props>): JSX.Element {
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
      <WriteConsumer {...viewProps} />
    </writeContext.Provider>
  )
}
