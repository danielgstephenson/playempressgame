import { WriterProps } from './types'
import WriteProvider from './WriteProvider'

export default function Writer <Props extends {}> ({
  fn,
  label,
  onCall,
  functions,
  props,
  WriteConsumer,
  ...viewProps
}: WriterProps<Props>): JSX.Element {
  if (functions == null) {
    return <></>
  }
  return (
    <WriteProvider
      fn={fn}
      WriteConsumer={WriteConsumer}
      label={label}
      onCall={onCall}
      functions={functions}
      props={props}
      {...viewProps}
    />
  )
}
