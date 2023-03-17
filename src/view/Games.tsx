import { Heading, Stack } from '@chakra-ui/react'
import { useContext } from 'react'
import authContext from '../context/auth'
import { GamesReader } from '../reader/game'
import AuthWarning from './AuthWarning'
import Curtain from './Curtain'
import GameItemView from './GameItem'
import Writer from './Writer'

export default function GamesView (): JSX.Element {
  const authState = useContext(authContext)
  return (
    <>
      <Heading>
        Games
        {' '}
        <Curtain open={authState.authed}>
          <Writer label='Add Game' fn='addGame' />
        </Curtain>
      </Heading>
      <Curtain open={authState.authed} hider={<AuthWarning />}>
        <Stack>
          <GamesReader DocView={GameItemView} />
        </Stack>
      </Curtain>
    </>
  )
}
