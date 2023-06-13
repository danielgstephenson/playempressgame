import { FC } from 'react'
import { CreatedWriterProps } from './types'
import Writer from './Writer'

export default function createWriter ({
  WriteConsumer
}: {
  WriteConsumer: FC
}): <Props extends {}>({ fn, functions, onCall, props }: CreatedWriterProps<Props>) => JSX.Element {
  return function CreatedWriter <Props extends {}> ({
    fn,
    functions,
    onCall,
    props,
    ...viewProps
  }: CreatedWriterProps<Props>): JSX.Element {
    return (
      <Writer
        fn={fn}
        WriteConsumer={WriteConsumer}
        onCall={onCall}
        functions={functions}
        props={props}
        {...viewProps}
      />
    )
  }
}
