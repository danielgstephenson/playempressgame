import { FC } from 'react'
import { CreatedWriterProps } from './types'
import Writer from './Writer'

export default function createWriter ({
  WritingView
}: {
  WritingView: FC
}): <Props extends {}>({ fn, functions, label, onCall, props }: CreatedWriterProps<Props>) => JSX.Element {
  return function CreatedWriter <Props extends {}> ({
    fn,
    functions,
    label,
    onCall,
    props
  }: CreatedWriterProps<Props>): JSX.Element {
    return (
      <Writer
        fn={fn}
        WritingView={WritingView}
        label={label}
        onCall={onCall}
        functions={functions}
        props={props}
      />
    )
  }
}
