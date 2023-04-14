import { Heading, Stack } from '@chakra-ui/react'
import { useContext } from 'react'
import authContext from '../context/auth'
import { GamesReader } from '../reader/game'
import Curtain from './Curtain'
import GameItemView from './GameItem'
import Warning from './Warning'
import Action from './Action'

export default function GamesView (): JSX.Element {
  const authState = useContext(authContext)
  const warning = <Warning>You are not signed in yet.</Warning>
  return (
    <>
      <Heading>
        Games
        {' '}
        <Curtain open={authState.authed}>
          <Action label='Add Game' fn='addGame' props={{ displayName: authState.displayName }} />
        </Curtain>
      </Heading>
      <Curtain open={authState.authed} hider={warning}>
        <Stack>
          <GamesReader DocView={GameItemView} />
        </Stack>
      </Curtain>
    </>
  )
}
