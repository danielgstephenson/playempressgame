import { FC, useContext } from 'react'
import { writeContext } from './context'
import { WriterComponent } from './types'

export default function createWriteConsumer <ViewProps> ({ WriterView }: {
  WriterView: WriterComponent
}): FC<ViewProps> {
  return function WriteConsumer (viewProps: ViewProps): JSX.Element {
    const writeState = useContext(writeContext)
    if (writeState.write == null || writeState.loading == null) {
      return <></>
    }
    async function handleClick (): Promise<void> {
      await writeState.write?.()
    }
    return (
      <WriterView
        onClick={handleClick}
        loading={writeState.loading}
        error={writeState.error}
        {...viewProps}
      />
    )
  }
}
