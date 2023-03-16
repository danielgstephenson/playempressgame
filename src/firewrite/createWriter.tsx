import { Functions } from 'firebase/functions'
import { FC, useContext } from 'react'
import { CloudCaller } from './types'
import Writer from './Writer'

export default function createWriter <Props extends {}> ({
  functionsContext,
  WriteView
}: {
  functionsContext: React.Context<{ functions?: Functions }>
  WriteView: FC
}): FC<any> {
  return function CreatedWriter ({
    fn,
    label,
    onCall,
    props
  }: {
    fn: string
    label: string
    onCall?: (caller: CloudCaller, props: Props) => Promise<void>
    props?: Props
  }): JSX.Element {
    const functionsState = useContext(functionsContext)
    return (
      <Writer
        fn={fn}
        WriteView={WriteView}
        label={label}
        onCall={onCall}
        functions={functionsState.functions}
        props={props}
      />
    )
  }
}
