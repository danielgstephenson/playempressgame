import { FC, useContext } from 'react'
import { writeContext } from './context'
import { WriteComponent } from './types'

export default function createWriting ({ WriteView }: {
  WriteView: WriteComponent
}): FC {
  return function Writing (): JSX.Element {
    const writeState = useContext(writeContext)
    if (writeState.write == null || writeState.label == null || writeState.loading == null) {
      return <></>
    }
    return (
      <WriteView
        write={writeState.write}
        loading={writeState.loading}
        label={writeState.label}
        error={writeState.error}
      />
    )
  }
}
