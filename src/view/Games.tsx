import { Alert, AlertIcon, Heading } from '@chakra-ui/react'
import GamesContentView from './GamesContent'
import AddGameWriter from './writer/AddGame'
import { useContext } from 'react'
import authContext from '../context/auth'
import Curtain from './Curtain'

export default function GamesView (): JSX.Element {
  const authState = useContext(authContext)
  const authed = authState.authed === true
  const warning = (
    <Alert status='warning'>
      <AlertIcon />
      You are not signed in yet.
    </Alert>
  )
  return (
    <Curtain
      open={authed}
      openElement={<GamesContentView />}
      closedElement={warning}
    >
      <Heading>Games <AddGameWriter /></Heading>
    </Curtain>
  )
}
