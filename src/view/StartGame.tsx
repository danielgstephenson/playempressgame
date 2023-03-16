import { useContext } from 'react'
import functionsContext from '../context/functions'
import Writer from '../firewrite'
import ChakraWrite from '../firewrite/ChakraWrite'

export default function StartGameView ({ gameId }: { gameId: string }): JSX.Element {
  const functionsState = useContext(functionsContext)
  return (
    <Writer
      fn='startGame'
      WriteView={ChakraWrite}
      functions={functionsState.functions}
      label='Start Game'
      props={{ gameId }}
      onCall={async (cloudFunction, props) => {
        console.log('before')
        await cloudFunction(props)
        console.log('after')
      }}
    />
  )
}
