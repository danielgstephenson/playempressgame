import { Alert, Box, Heading, HStack, Text } from '@chakra-ui/react'
import { profileContext } from '../reader/profile'
import PlayerReader from '../reader/player'
import { Fragment, useContext } from 'react'
import { gameContext } from '../reader/game'
import Curtain from './Curtain'
import PlayerView from './Player'
import authContext from '../context/auth'

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
          <HStack>
            <Heading size='sm'>Gold:</Heading>
            <Text>{profileState.gold}</Text>
          </HStack>
          <HStack>
            <Heading size='sm'>Top Discard:</Heading>
            <Text>{profileState.topDiscard}</Text>
          </HStack>
          <HStack>
            <Heading size='sm'>Deck Empty:</Heading>
            <Text>{deckEmpty}</Text>
          </HStack>
          <Curtain open={showPlayer}>
            <PlayerReader DocView={PlayerView} />
          </Curtain>
        </Curtain>
      </Box>
    </Container>
  )
}
