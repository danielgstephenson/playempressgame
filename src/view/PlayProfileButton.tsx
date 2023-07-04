import { CheckIcon } from '@chakra-ui/icons'
import { useContext } from 'react'
import profileContext from '../context/profile'
import { gameContext } from '../reader/game'
import isTaking from '../service/isTaking'
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
  const taking = isTaking({ game: gameState, userId: profileState.userId })
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
    const message = `${profileState.displayName} is ready.`
    return (
      <TopPopoverIconButtonView
        aria-label={message}
        disabled
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
