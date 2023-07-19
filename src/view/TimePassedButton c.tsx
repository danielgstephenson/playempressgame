import { RepeatClockIcon } from '@chakra-ui/icons'
import { useContext } from 'react'
import { gameContext } from '../reader/game'
import PopoverIconButton from './PopoverIconButton'

export default function TimePassedButton (): JSX.Element {
  const gameState = useContext(gameContext)
  if (gameState.profiles == null) {
    return <></>
  }
  const message = `Because the total time in play was more than ${gameState.profiles.length + 1}, the leftmost timeline scheme was summoned to the court.`
  if (gameState.timePassed === true) {
    return (
      <PopoverIconButton size='xs' aria-label={message} icon={<RepeatClockIcon />}>
        {message}
      </PopoverIconButton>
    )
  }
  return <></>
}
