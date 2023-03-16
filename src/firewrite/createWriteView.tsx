import { FC, useContext } from 'react'
import { writeContext } from '.'

type WriteComponent = ({ action, label, loading, error }: {
  action: () => void
  label: string
  loading: boolean
  error?: Error
}) => JSX.Element

export default function createWriteView ({ WriteView }: {
  WriteView: WriteComponent
}): FC {
  return function WRiteView (): JSX.Element {
    const writeState = useContext(writeContext)
    if (writeState.write == null || writeState.label == null || writeState.loading == null) {
      return <></>
    }
    return (
      <WriteView
        action={writeState.write}
        loading={writeState.loading}
        label={writeState.label}
        error={writeState.error}
      />
    )
  }
}
