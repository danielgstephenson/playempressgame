import ChakraWriter from '../lib/firewrite/chakra/Writer'
import functionsContext from '../context/functions'
import { useContext } from 'react'
import { ConsumerWriterProps } from '../lib/firewrite/types'

export default function Writer <Props extends {}> ({
  fn,
  label,
  onCall,
  props
}: ConsumerWriterProps<Props>): JSX.Element {
  const functionsState = useContext(functionsContext)
  return (
    <ChakraWriter
      functions={functionsState.functions}
      fn={fn}
      label={label}
      onCall={onCall}
      props={props}
    />
  )
}
