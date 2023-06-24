import { Box, Heading, Modal, ModalContent, ModalOverlay, Stack, useDisclosure } from '@chakra-ui/react'
import PlayerReader from '../reader/player'
import { useContext } from 'react'
import { gameContext } from '../reader/game'
import Curtain from './Curtain'
import PlayerView from './Player'
import authContext from '../context/auth'
import Status from './Status'
import profileContext from '../context/profile'
import PublicTrashView from './PublicTrash'
import PublicTableauView from './PublicTableau'
import ExpandedSchemeView from './ExpandedScheme'
import SmallSchemeView from './SmallScheme'
import ChakraButton from '../lib/firewrite/chakra/Button'

export default function ProfileView (): JSX.Element {
  const profileState = useContext(profileContext)
  const authState = useContext(authContext)
  const gameState = useContext(gameContext)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const currentPlayer = authState.currentUser?.uid === profileState.userId
  const playing = gameState.phase !== 'join'
  if (currentPlayer) {
    if (playing) {
      return <PlayerReader DocView={PlayerView} />
    }
    return <Heading size='md'>{profileState.displayName}</Heading>
  }
  const deckFull = profileState.deckEmpty !== true
  const bidding = gameState.phase === 'auction'
  const content = bidding ? <>({profileState.bid})</> : undefined
  return (
    <>
      <ChakraButton onClick={onOpen}>
        {profileState.displayName}
        {' '}
        {content}
      </ChakraButton>
      <Curtain open={playing}>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent width='auto' onClick={onClose}>
            <Stack direction='row'>
              <Box>
                <Heading size='md'>{profileState.displayName}</Heading>
                <Status label='Bid' value={profileState.bid} />
                <Status label='Gold' value={profileState.gold} />
                <Status label='Silver' value={profileState.silver} />
                <PublicTableauView />
                <PublicTrashView />
                <Heading size='sm'>Deck</Heading>
                <Curtain open={deckFull}>
                  <SmallSchemeView bg='gray.500' />
                </Curtain>
              </Box>
              <Box>
                <Heading size='sm'>Discard</Heading>
                <ExpandedSchemeView
                  rank={profileState.topDiscardScheme?.rank}
                  onClick={onOpen}
                />
              </Box>
            </Stack>
          </ModalContent>
        </Modal>
      </Curtain>
    </>
  )
}
