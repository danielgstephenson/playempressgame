import { Alert, Box, Heading, HStack, Text } from '@chakra-ui/react'
import { profileContext } from '../reader/profile'
import PlayerReader from '../reader/player'
import { Fragment, useContext } from 'react'
import { gameContext } from '../reader/game'
import Curtain from './Curtain'
import PlayerView from './Player'
import authContext from '../context/auth'
import Status from './Status'

export default function ProfileItemView (): JSX.Element {
  const profileState = useContext(profileContext)
  const authState = useContext(authContext)
  const gameState = useContext(gameContext)
  const playing = gameState.phase !== 'join'
  const showPlayer = authState.currentUser?.uid === profileState.userId
  const Container = showPlayer ? Alert : Fragment
  const deckEmpty = profileState.deckEmpty === true ? 'True' : 'False'
  return (
    <Container>
      <Box>
        <Heading size='md'>Profile: {profileState.displayName}</Heading>
        <Curtain open={playing}>
          <Status label='Gold' value={profileState.gold} />
          <Status label='Top Discard' value={profileState.topDiscard} />
          <Status label='Deck Empty' value={deckEmpty} />
          <Curtain open={showPlayer}>
            <PlayerReader DocView={PlayerView} />
          </Curtain>
        </Curtain>
      </Box>
    </Container>
  )
}
