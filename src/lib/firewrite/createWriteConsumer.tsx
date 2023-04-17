import { FC, useContext } from 'react'
import { writeContext } from './context'
import { WriterComponent } from './types'

export default function CreateWriteConsumer <ViewProps> ({ WriterView }: {
  WriterView: WriterComponent
}): FC<ViewProps> {
  return function WriteConsumer (viewProps: ViewProps): JSX.Element {
    const writeState = useContext(writeContext)
    if (writeState.write == null || writeState.label == null || writeState.loading == null) {
      return <></>
    }
    async function handleClick (): Promise<void> {
      await writeState.write?.()
    }
    return (
      <WriterView
        onClick={handleClick}
        loading={writeState.loading}
        label={writeState.label}
        error={writeState.error}
        {...viewProps}
      />
    )
  }
}
