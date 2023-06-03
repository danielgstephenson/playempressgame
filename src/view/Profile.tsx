import { Alert, Box, Heading } from '@chakra-ui/react'
import PlayerReader from '../reader/player'
import { Fragment, useContext } from 'react'
import { gameContext } from '../reader/game'
import Curtain from './Curtain'
import PlayerView from './Player'
import authContext from '../context/auth'
import Status from './Status'
import profileContext from '../context/profile'
import PublicTrashView from './PublicTrash'

export default function ProfileView (): JSX.Element {
  const profileState = useContext(profileContext)
  const authState = useContext(authContext)
  const gameState = useContext(gameContext)
  const playing = gameState.phase !== 'join'
  const showPlayer = authState.currentUser?.uid === profileState.userId
  const Container = showPlayer ? Alert : Fragment
  const deckEmpty = profileState.deckEmpty === true
  return (
    <Container>
      <Box width='100%'>
        <Heading size='md'>Profile: {profileState.displayName}</Heading>
        <Curtain open={playing}>
          <Status label='Bid' value={profileState.bid} />
          <Status label='Gold' value={profileState.gold} />
          <Status label='Silver' value={profileState.silver} />
          <Status label='Top Discard' value={profileState.topDiscardScheme?.rank} />
          <Status label='Deck Empty' value={deckEmpty} />
          <Curtain open={!showPlayer}>
            <PublicTrashView />
          </Curtain>
          <Curtain open={showPlayer}>
            <PlayerReader DocView={PlayerView} />
          </Curtain>
        </Curtain>
      </Box>
    </Container>
  )
}
