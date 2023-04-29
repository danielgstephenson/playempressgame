import { Alert, Box, Heading } from '@chakra-ui/react'
import { profileContext } from '../reader/profile'
import PlayerReader from '../reader/player'
import { Fragment, useContext } from 'react'
import { gameContext } from '../reader/game'
import Curtain from './Curtain'
import PlayerView from './Player'
import authContext from '../context/auth'
import Status from './Status'

export default function ProfileView (): JSX.Element {
  const profileState = useContext(profileContext)
  const authState = useContext(authContext)
  const gameState = useContext(gameContext)
  const playing = gameState.phase !== 'join'
  const showPlayer = authState.currentUser?.uid === profileState.userId
  const Container = showPlayer ? Alert : Fragment
  const deckEmpty = profileState.deckEmpty === true
  const ready = profileState.ready === true
  return (
    <Container>
      <Box width='100%'>
        <Heading size='md'>Profile: {profileState.displayName}</Heading>
        <Curtain open={playing}>
          <Status label='Gold' value={profileState.gold} />
          <Status label='Silver' value={profileState.silver} />
          <Status label='Top Discard' value={profileState.topDiscardScheme?.rank} />
          <Status label='Deck Empty' value={deckEmpty} />
          <Status label='Play Area Empty' value={profileState.playEmpty} />
          <Status label='Trash Area Empty' value={profileState.trashEmpty} />
          <Status label='Ready' value={ready} />
          <Curtain open={showPlayer}>
            <PlayerReader DocView={PlayerView} />
          </Curtain>
        </Curtain>
      </Box>
    </Container>
  )
}
