import { useContext } from 'react'
import functionsContext from '../context/functions'
import ChakraWrite from '../firewrite/ChakraWrite'
import Writer from '../firewrite/Writer'

export default function JoinGameView ({ gameId }: { gameId: string }): JSX.Element {
  const functionsState = useContext(functionsContext)
  return (
    <Writer
      fn='joinGame'
      WriteView={ChakraWrite}
      label='Join Game'
      props={{ gameId }}
      functions={functionsState.functions}
    />
  )
}
