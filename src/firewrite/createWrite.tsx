import { FC, useContext } from 'react'
import { writeContext } from './context'

type WriteComponent = ({ action, label, loading, error }: {
  action: () => void
  label: string
  loading: boolean
  error?: Error
}) => JSX.Element

export default function createWrite ({ WriteView }: {
  WriteView: WriteComponent
}): FC {
  return function CreatedWrite (): JSX.Element {
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
