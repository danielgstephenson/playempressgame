import { FC } from 'react'
import { CreatedWriterProps } from './types'
import Writer from './Writer'

export default function createWriter ({
  WriteConsumer
}: {
  WriteConsumer: FC
}): <Props extends {}>({ fn, functions, label, onCall, props }: CreatedWriterProps<Props>) => JSX.Element {
  return function CreatedWriter <Props extends {}> ({
    fn,
    functions,
    label,
    onCall,
    props,
    ...viewProps
  }: CreatedWriterProps<Props>): JSX.Element {
    return (
      <Writer
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
}
