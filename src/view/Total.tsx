import { Button } from '@chakra-ui/react'
import { useContext, useMemo } from 'react'
import { gameContext } from '../reader/game'
import areAllReady from '../service/areAllReady'
import PopoverMessageView from './PopoverMessage'

export default function TotalView (): JSX.Element {
  const gameState = useContext(gameContext)
  const { court, phase, profiles, timeline } = gameState
  const courtTotal = useMemo(() => {
    if (court == null) return 0
    const courtTotal = court.reduce((courtTotal, scheme) => {
      return courtTotal + scheme.rank
    }, 0)
    return courtTotal
  }, [court])
  const leftmost = useMemo(() => timeline?.[0], [timeline])
  const bg = useMemo(() => {
    if (court == null) return 'gray'
    const schemes = [...court]
    if (leftmost != null) schemes.push(leftmost)
    const rgb = schemes.reduce((rgb, scheme) => {
      if (scheme.color === 'yellow') {
        rgb[0] += 183 / schemes.length
        rgb[1] += 121 / schemes.length
        rgb[2] += 31 / schemes.length
      } else if (scheme.color === 'red') {
        rgb[0] += 197 / schemes.length
        rgb[1] += 48 / schemes.length
        rgb[2] += 48 / schemes.length
      } else if (scheme.color === 'green') {
        rgb[0] += 47 / schemes.length
        rgb[1] += 133 / schemes.length
        rgb[2] += 90 / schemes.length
      }
      return rgb
    }, [0, 0, 0])
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
  }, [court, leftmost])
  const total = useMemo(() => leftmost == null ? courtTotal : courtTotal + leftmost.rank, [courtTotal, leftmost])
  const allReady = areAllReady(profiles)
  if (phase !== 'auction' || allReady) return <></>
  const number = <Button bg={bg} alignSelf='end'>{total}</Button>
  const timelineMessage = leftmost?.rank ?? 'nothing'
  return (
    <PopoverMessageView trigger={number}>
      {courtTotal} in the court + {timelineMessage} from the timeline
    </PopoverMessageView>
  )
}
