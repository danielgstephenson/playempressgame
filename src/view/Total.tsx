import { Button } from '@chakra-ui/react'
import { useContext, useMemo } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import areAllReady from '../service/areAllReady'
import PopoverMessageView from './PopoverMessage'

export default function TotalView (): JSX.Element {
  const gameState = useContext(gameContext)
  const { court, dungeon, phase, profiles, timeline } = gameState
  const { tableau } = useContext(playContext)
  const courtTotal = useMemo(() => {
    if (court == null) return 0
    const courtTotal = court.reduce((courtTotal, scheme) => {
      return courtTotal + scheme.rank
    }, 0)
    return courtTotal
  }, [court])
  const leftmost = useMemo(() => timeline?.[0], [timeline])
  const dungeonTotal = useMemo(() => {
    if (dungeon == null) return 0
    const dungeonTotal = dungeon.reduce((dungeonTotal, scheme) => {
      return dungeonTotal + scheme.rank
    }, 0)
    return dungeonTotal
  }, [dungeon])
  const twelve = useMemo(() => {
    if (tableau == null || court == null) return false
    if (tableau.some((scheme) => scheme.rank === 12)) return true
    if (court.some((scheme) => scheme.rank === 12)) return true
    return false
  }, [court, tableau])
  const schemes = useMemo(() => {
    if (court == null || dungeon == null) return []
    const schemes = [...court]
    if (leftmost != null) schemes.push(leftmost)
    if (twelve) schemes.push(...dungeon)
    return schemes
  }, [court, dungeon, twelve, leftmost])
  const bg = useMemo(() => {
    const totalRank = schemes.reduce((totalRank, scheme) => {
      return totalRank + scheme.rank
    }, 0)
    const rgb = schemes.reduce((rgb, scheme) => {
      const rankFactor = scheme.rank / totalRank
      if (scheme.color === 'yellow') {
        rgb[0] += 183 * rankFactor
        rgb[1] += 121 * rankFactor
        rgb[2] += 31 * rankFactor
      } else if (scheme.color === 'red') {
        rgb[0] += 197 * rankFactor
        rgb[1] += 48 * rankFactor
        rgb[2] += 48 * rankFactor
      } else if (scheme.color === 'green') {
        rgb[0] += 47 * rankFactor
        rgb[1] += 133 * rankFactor
        rgb[2] += 90 * rankFactor
      }
      return rgb
    }, [0, 0, 0])
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
  }, [schemes])
  const total = useMemo(() => {
    return schemes.reduce((total, scheme) => {
      return total + scheme.rank
    }, 0)
  }, [schemes])
  const allReady = areAllReady(profiles)
  if (phase !== 'auction' || allReady || gameState.dungeon == null) return <></>
  const number = <Button bg={bg} alignSelf='end'>{total}</Button>
  const timelineMessage = leftmost?.rank ?? 'nothing'
  const dungeonTotalMessage = gameState.dungeon.length > 0 ? dungeonTotal : 'nothing'
  const dungeonMessage = twelve ? ` + ${dungeonTotalMessage} from the dungeon` : ''
  return (
    <PopoverMessageView trigger={number}>
      {courtTotal} in the court + {timelineMessage} from the timeline{dungeonMessage}
    </PopoverMessageView>
  )
}
