import { StarIcon, UnlockIcon } from '@chakra-ui/icons'
import { Button, ButtonGroup, HStack, IconButton, Text } from '@chakra-ui/react'
import { useContext, useMemo } from 'react'
import authContext from '../context/auth'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import areAllReady from '../service/areAllReady'
import PopoverMessageView from './PopoverMessage'

export default function TotalView (): JSX.Element {
  const gameState = useContext(gameContext)
  const { court, dungeon, phase, profiles, timeline } = gameState
  const { tableau } = useContext(playContext)
  const authState = useContext(authContext)
  const { userId } = authState
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
    if (leftmost?.rank === 12) return true
    return false
  }, [court, tableau, leftmost])
  const otherThirteen = useMemo(() => {
    if (profiles == null || userId == null) return false
    const otherThirteen = profiles.some((profile) => {
      if (profile.userId === userId) return false
      const thirteen = profile.tableau.some((scheme) => scheme.rank === 13)
      return thirteen
    })
    return otherThirteen
  }, [profiles, userId])
  const schemes = useMemo(() => {
    if (court == null || dungeon == null) return []
    const schemes = []
    if (!otherThirteen) schemes.push(...court)
    if (leftmost != null) schemes.push(leftmost)
    if (twelve) schemes.push(...dungeon)
    return schemes
  }, [court, dungeon, leftmost, otherThirteen, twelve])
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
  if (phase !== 'auction' || allReady || gameState.dungeon == null || gameState.timeline == null) return <></>
  const imprisonIcon = twelve && <UnlockIcon />
  const totalButton = <Button bg={bg}><HStack alignItems='start'><Text>{total}</Text> {imprisonIcon}</HStack></Button>
  const timelineMessage = leftmost == null ? 'nothing' : leftmost.rank
  const dungeonTotalMessage = gameState.dungeon.length > 0 ? dungeonTotal : 'nothing'
  const dungeonMessage = twelve ? ` + ${dungeonTotalMessage} from the dungeon` : ''
  const courtTotalMessage = courtTotal > 0 ? courtTotal : 'nothing'
  const courtMessage = otherThirteen ? '' : `${courtTotalMessage} in the court + `
  const courtPopover = (
    <PopoverMessageView trigger={totalButton} _firstLetter={{ textTransform: 'capitalize' }}>
      {courtMessage}{timelineMessage} from the timeline{dungeonMessage}
    </PopoverMessageView>
  )
  const finalPopover = gameState.timeline.length <= 1 && (
    <PopoverMessageView trigger={<IconButton color={bg} aria-label='Final auction' icon={<StarIcon />} />}>
      Final auction
    </PopoverMessageView>
  )
  return (
    <ButtonGroup isAttached alignSelf='end'>
      {courtPopover}
      {finalPopover}
    </ButtonGroup>
  )
}
