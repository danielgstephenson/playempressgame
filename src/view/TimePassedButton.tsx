import { RepeatClockIcon } from '@chakra-ui/icons'
import { useContext } from 'react'
import { gameContext } from '../reader/game'
import PopoverIconButton from './PopoverIconButton'

export default function ImprisonedButton (): JSX.Element {
  const gameState = useContext(gameContext)
  if (gameState.profiles?.length == null) return <></>
  const totalTime = gameState.profiles.reduce((total, profile) => total + (profile.playScheme?.time ?? 0), 0)
  const message = `The total time in play was ${totalTime}, more than the ${gameState.profiles.length} players.`
  if (gameState.timePassed === true) {
    return (
      <PopoverIconButton size='xs' aria-label={message} icon={<RepeatClockIcon />}>
        {message}
      </PopoverIconButton>
    )
  }
  return <></>
}
