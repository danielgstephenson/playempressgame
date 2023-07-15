import { CheckIcon, MinusIcon, SmallCloseIcon, StarIcon } from '@chakra-ui/icons'
import { HStack, Text } from '@chakra-ui/react'
import { useContext } from 'react'
import profileContext from '../context/profile'
import { gameContext } from '../reader/game'
import getScore from '../service/getScore'
import getWinners from '../service/getWinners'
import isTaking from '../service/isTaking'
import TopPopoverButtonView from './TopPopoverButton'
import TopPopoverIconButtonView from './TopPopoverIconButton'
import WaitingButtonView from './WaitingButton'

export default function PlayProfileButtonView (): JSX.Element {
  const gameState = useContext(gameContext)
  const profileState = useContext(profileContext)
  if (
    gameState.choices == null ||
    gameState.court == null ||
    gameState.dungeon == null ||
    gameState.id == null ||
    gameState.profiles == null ||
    profileState.playReady == null ||
    profileState.userId == null ||
    profileState.displayName == null ||
    profileState.tableau == null
  ) return <></>
  const playerId = `${profileState.userId}_${gameState.id}`
  const choice = gameState.choices.find(choice => choice.playerId === playerId)
  if (choice?.type === 'trash') {
    const message = `${profileState.displayName} is ready to trash.`
    return (
      <WaitingButtonView aria-label={message} />
    )
  }
  if (choice?.type === 'deck') {
    if (gameState.phase === 'play') {
      return (
        <WaitingButtonView
          aria-label={`${profileState.displayName} is choosing a scheme from their hand to put on the bottom of their deck.`}
        />
      )
    } else {
      return (
        <WaitingButtonView
          aria-label={`${profileState.displayName} is reordering their deck.`}
        />
      )
    }
  }
  const taking = isTaking({ profiles: gameState.profiles, userId: profileState.userId })
  if (taking) {
    const tableauTwelve = profileState.tableau.some(scheme => scheme.rank === 12)

    const courtEmpty = gameState.court.length === 0
    if (tableauTwelve && courtEmpty) {
      const message = `${profileState.displayName} is taking schemes from the dungeon.`
      return (
        <WaitingButtonView bg='slategray' color='white' aria-label={message} />
      )
    }
    const twelve = tableauTwelve || gameState.court.some(scheme => scheme.rank === 12)
    const dungeonEmpty = gameState.dungeon.length === 0
    if (!twelve || dungeonEmpty) {
      const message = `${profileState.displayName} is taking schemes from the court.`
      return (
        <WaitingButtonView aria-label={message} />
      )
    }
    const message = `${profileState.displayName} is taking schemes from the court and dungeon.`
    return (
      <WaitingButtonView bg='slategray' color='white' aria-label={message} />
    )
  }
  if (gameState.phase !== 'play') return <></>
  if (profileState.playReady) {
    const allReady = gameState.profiles.every(profile => profile.playReady)
    if (gameState.final === true && allReady && gameState.choices?.length === 0) {
      const score = getScore(profileState)
      const winners = getWinners({ profiles: gameState.profiles })
      const winner = winners.some(winner => winner.userId === profileState.userId)
      if (winner) {
        if (winners.length > 1) {
          const message = `${profileState.displayName} ties at ${score}.`
          return (
            <TopPopoverButtonView
              bg='slategrey'
              color='white'
              label={<HStack><MinusIcon /> <Text>{score}</Text></HStack>}
            >
              {message}
            </TopPopoverButtonView>
          )
        }
        const message = `${profileState.displayName} wins with ${score}.`
        return (
          <TopPopoverButtonView
            bg='black'
            color='white'
            label={<HStack><StarIcon /> <Text>{score}</Text></HStack>}
          >
            {message}
          </TopPopoverButtonView>
        )
      } else {
        const message = `${profileState.displayName} loses with ${score}.`
        return (
          <TopPopoverButtonView
            bg='white'
            color='black'
            label={<HStack><SmallCloseIcon /> <Text>{score}</Text></HStack>}
          >
            {message}
          </TopPopoverButtonView>
        )
      }
    }
    const message = `${profileState.displayName} is ready.`
    return (
      <TopPopoverIconButtonView
        aria-label={message}
        bg='black'
        color='white'
        icon={<CheckIcon />}
      >
        {message}
      </TopPopoverIconButtonView>
    )
  }
  return (
    <WaitingButtonView
      aria-label={`${profileState.displayName} is choosing a scheme from their hand to play and another to trash.`}
    />
  )
}
