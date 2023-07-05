import { Box, Button, ButtonGroup, Heading, HStack, IconButton, Modal, ModalContent, ModalOverlay, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, useDisclosure, VStack } from '@chakra-ui/react'
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
import InPlaySchemeView from './InPlayScheme'
import DiscardButtonView from './DiscardButton'
import BidProfileButtonView from './BidProfileButton'
import PopoverButtonView from './PopoverButton'
import TopPopoverButtonView from './TopPopoverButton'
import PlayProfileButtonView from './PlayProfileButton'
import { QuestionIcon } from '@chakra-ui/icons'
import { BUTTON_GRAY_BORDER } from '../constants'
import ProfileHeadingView from './ProfileHeading'

export default function ProfileView (): JSX.Element {
  const profileState = useContext(profileContext)
  const authState = useContext(authContext)
  const gameState = useContext(gameContext)
  const { isOpen, onOpen, onClose } = useDisclosure()
  if (profileState.gold == null || profileState.silver == null || profileState.displayName == null || profileState.bid == null) {
    return <></>
  }
  const currentPlayer = authState.currentUser?.uid === profileState.userId
  const playing = gameState.phase !== 'join'
  if (currentPlayer) {
    if (playing) {
      return <PlayerReader DocView={PlayerView} />
    }
    return <ProfileHeadingView />
  }
  if (gameState.phase === 'join') {
    return <ProfileHeadingView />
  }
  const deckFull = profileState.deckEmpty !== true
  const inPlay = profileState
    .tableau
    ?.map(scheme => <InPlaySchemeView key={scheme.id} rank={scheme.rank} />)
  const fullMessage = `${profileState.displayName}'s deck is not empty`
  const deckButton = deckFull
    ? (
      <Popover>
        <PopoverTrigger>
          <IconButton aria-label={fullMessage} disabled bg='gray.600' color='white' icon={<QuestionIcon />} />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>{fullMessage}</PopoverBody>
        </PopoverContent>
      </Popover>
      )
    : (
      <PopoverButtonView bg='transparent' border={BUTTON_GRAY_BORDER}>
        {profileState.displayName}'s deck is empty
      </PopoverButtonView>
      )
  return (
    <>
      <VStack spacing='0'>
        <ButtonGroup size='xs' isAttached>
          <PlayProfileButtonView />
          <BidProfileButtonView />
          <TopPopoverButtonView
            bg='yellow.400'
            color='black'
            _hover={{ bg: 'yellow.600', color: 'white' }}
            label={profileState.gold}
          >
            {profileState.displayName} has {profileState.gold} gold.
          </TopPopoverButtonView>
          <TopPopoverButtonView
            disabled bg='gray.400'
            color='black'
            _hover={{ bg: 'gray.600', color: 'white' }}
            label={profileState.silver}
          >
            {profileState.displayName} has {profileState.silver} silver.
          </TopPopoverButtonView>
        </ButtonGroup>
        <ButtonGroup size='xs' isAttached>
          {deckButton}
          <Button onClick={onOpen}>
            {profileState.displayName}
          </Button>
          <DiscardButtonView />
        </ButtonGroup>
        <HStack borderBottomRadius='md' spacing='0' overflow='hidden'>
          {inPlay}
        </HStack>
      </VStack>
      <Curtain open={playing}>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent width='auto' onClick={onClose}>
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
              />
            </Box>
          </ModalContent>
        </Modal>
      </Curtain>
    </>
  )
}
