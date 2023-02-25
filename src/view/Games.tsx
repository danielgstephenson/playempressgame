import { Alert, AlertIcon, Heading } from '@chakra-ui/react'
import GamesContentView from './GamesContent'
import AddGameView from './AddGame'
import { useContext } from 'react'
import authContext from '../context/auth'

export default function GamesView (): JSX.Element {
  const authState = useContext(authContext)
  const content = authState.authed === true ? <GamesContentView /> : <Alert status='warning'><AlertIcon />You are not signed in yet.</Alert>
  return (
    <>
      <Heading>Games <AddGameView /></Heading>
      {content}
    </>
  )
}
