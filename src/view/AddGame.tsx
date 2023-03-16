import { useContext } from 'react'
import authContext from '../context/auth'
import functionsContext from '../context/functions'
import Writer from '../firewrite/Writer'
import ChakraWrite from '../firewrite/ChakraWrite'

export default function AddGameView (): JSX.Element {
  const authState = useContext(authContext)
  const functionsState = useContext(functionsContext)
  if (authState.authed !== true) {
    return <></>
  }
  return (
    <Writer
      label='Add Game'
      fn='addGame'
      functions={functionsState.functions}
      WriteView={ChakraWrite}
    />
  )
}
