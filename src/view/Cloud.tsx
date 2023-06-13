import ChakraWriter from '../lib/firewrite/chakra/Writer'
import functionsContext from '../context/functions'
import { useContext } from 'react'
import { ConsumerWriterProps } from '../lib/firewrite/types'
import { ButtonProps } from '@chakra-ui/react'

export default function Cloud <Props extends {}> ({
  fn,
  onCall,
  props,
  ...buttonProps
}: ConsumerWriterProps<Props> & ButtonProps): JSX.Element {
  const functionsState = useContext(functionsContext)
  return (
    <ChakraWriter
      functions={functionsState.functions}
      fn={fn}
      onCall={onCall}
      props={props}
      {...buttonProps}
    />
  )
}
