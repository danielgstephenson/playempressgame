import { CheckIcon } from '@chakra-ui/icons'
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, IconButton } from '@chakra-ui/react'
import { useContext } from 'react'
import profileContext from '../context/profile'
import { gameContext } from '../reader/game'
import TopPopoverButtonView from './TopPopoverButton'

export default function PlayProfileButtonView (): JSX.Element {
  const gameState = useContext(gameContext)
  const profileState = useContext(profileContext)
  if (profileState.playReady == null || profileState.userId == null || gameState.choices == null || gameState.id == null || profileState.displayName == null) return <></>
  const playerId = `${profileState.userId}_${gameState.id}`
  const choice = gameState.choices.find(choice => choice.playerId === playerId)
  if (choice?.type === 'trash') {
    return (
      <TopPopoverButtonView bg='white' color='black' label='...'>
        {profileState.displayName} is choosing a scheme to trash from their hand.
      </TopPopoverButtonView>
    )
  }
  if (choice?.type === 'deck') {
    if (gameState.phase === 'play') {
      return (
        <TopPopoverButtonView bg='white' color='black' label='...'>
          {profileState.displayName} is choosing a scheme from their hand to put on the bottom of their deck.
        </TopPopoverButtonView>
      )
    } else {
      return (
        <TopPopoverButtonView bg='white' color='black' label='...'>
          {profileState.displayName} is reordering their deck.
        </TopPopoverButtonView>
      )
    }
  }
  if (gameState.phase !== 'play') return <></>
  if (profileState.playReady) {
    const message = `${profileState.displayName} is ready.`
    return (
      <Popover>
        <PopoverTrigger>
          <IconButton aria-label={message} disabled bg='black' color='white' icon={<CheckIcon />} />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>{message}</PopoverBody>
        </PopoverContent>
      </Popover>
    )
  }
  return (
    <TopPopoverButtonView bg='white' color='black' label='...'>
      {profileState.displayName} is choosing a scheme from their hand to play and another to trash.
    </TopPopoverButtonView>
  )
}
