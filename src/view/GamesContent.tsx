import { Alert, AlertIcon, Stack } from '@chakra-ui/react'
import { useContext } from 'react'
import authContext from '../context/auth'
import { GamesReader } from '../reader/game'

export default function GamesContentView (): JSX.Element {
  const authState = useContext(authContext)
  const authed = authState.authed === true
  if (!authed) {
    return (
      <Alert status='warning'>
        <AlertIcon />
        You are not signed in yet.
      </Alert>
    )
  }
  return (
    <Stack>
      <GamesReader />
    </Stack>
  )
}
