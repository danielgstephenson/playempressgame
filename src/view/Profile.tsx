import { Button, ButtonGroup, HStack, IconButton, Modal, ModalContent, ModalOverlay, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, useDisclosure, VStack } from '@chakra-ui/react'
import { useContext } from 'react'
import { gameContext } from '../reader/game'
import Curtain from './Curtain'
import authContext from '../context/auth'
import profileContext from '../context/profile'
import InPlaySchemeView from './InPlayScheme'
import LastReserveButtonView from './LastReserveButton'
import BidProfileButtonView from './BidProfileButton'
import PopoverButtonView from './PopoverButton'
import TopPopoverButtonView from './TopPopoverButton'
import PlayProfileButtonView from './PlayProfileButton'
import { QuestionIcon } from '@chakra-ui/icons'
import { BUTTON_GRAY_BORDER } from '../constants'
import ProfileHeadingView from './ProfileHeading'
import ExpandedProfileView from './ExpandedProfile'

export default function ProfileView (): JSX.Element {
  const profileState = useContext(profileContext)
  const authState = useContext(authContext)
  const gameState = useContext(gameContext)
  const { isOpen, onOpen, onClose } = useDisclosure()
  if (
    profileState.gold == null ||
    profileState.silver == null ||
    profileState.displayName == null ||
    profileState.bid == null ||
    profileState.reserveLength == null
  ) {
    return <></>
  }
  const currentPlayer = authState.currentUser?.uid === profileState.userId
  const playing = gameState.phase !== 'join'
  if (currentPlayer && playing) {
    throw new Error('ProfileView should not be rendered for the current player')
  }
  if (gameState.phase === 'join') {
    return <ProfileHeadingView />
  }
  const reserveFull = profileState.reserveLength > 0
  const inPlay = profileState
    .inPlay
    ?.map(scheme => <InPlaySchemeView key={scheme.id} id={scheme.id} rank={scheme.rank} />)
  const fullMessage = `${profileState.displayName}'s reseve has ${profileState.reserveLength} schemes.`
  const reserveStartViews = new Array(profileState.reserveLength - 1).fill(0).map((_, index) => {
    return (
      <Popover key={index}>
        <PopoverTrigger>
          <IconButton
            aria-label={fullMessage}
            disabled bg='gray.600'
            color='white'
            icon={<QuestionIcon />}
            minW='30px'
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>{fullMessage}</PopoverBody>
        </PopoverContent>
      </Popover>
    )
  })
  const reserveView = reserveFull
    ? (
      <HStack spacing='0' overflow='hidden'>
        {reserveStartViews}
        <LastReserveButtonView />
      </HStack>
      )
    : (
      <PopoverButtonView bg='transparent' border={BUTTON_GRAY_BORDER}>
        {profileState.displayName}'s reserve is empty
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
        {reserveView}
        <ButtonGroup size='xs' isAttached>
          <Button onClick={onOpen}>
            {profileState.displayName}
          </Button>
        </ButtonGroup>
        <HStack borderBottomRadius='md' spacing='0' overflow='hidden'>
          {inPlay}
        </HStack>
      </VStack>
      <Curtain open={playing}>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent width='auto' onClick={onClose}>
            <ExpandedProfileView />
          </ModalContent>
        </Modal>
      </Curtain>
    </>
  )
}
