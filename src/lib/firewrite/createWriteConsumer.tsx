import { FC, useContext } from 'react'
import { writeContext } from './context'
import { WritingComponent } from './types'

export default function CreateWriteConsumer ({ WritingView }: {
  WritingView: WritingComponent
}): FC {
  return function WriteConsumer (): JSX.Element {
    const writeState = useContext(writeContext)
    if (writeState.write == null || writeState.label == null || writeState.loading == null) {
      return <></>
    }
    return (
      <WritingView
        write={writeState.write}
        loading={writeState.loading}
        label={writeState.label}
        error={writeState.error}
      />
    )
  }
}
