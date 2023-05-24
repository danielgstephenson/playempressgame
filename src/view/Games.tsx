import { Heading, Stack } from '@chakra-ui/react'
import { useContext } from 'react'
import authContext from '../context/auth'
import { GamesReader } from '../reader/game'
import Curtain from './Curtain'
import GameItemView from './GameItem'
import Warning from './Warning'
import Cloud from './Cloud'

export default function GamesView (): JSX.Element {
  const authState = useContext(authContext)
  const warning = <Warning>You are not signed in yet.</Warning>
  return (
    <>
      <Heading>
        Games
        {' '}
        <Curtain open={authState.authed}>
          <Cloud label='Add Game' fn='addGame' />
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
