import { Profile, Scheme } from '../types'
import { Text } from '@chakra-ui/react'
import getGoldColor from '../service/getGoldColor'
import getSilverColor from '../service/getSilverColor'

export default function BidStatusView ({
  bg,
  bid,
  debug = false,
  profiles,
  silver,
  inPlay,
  userId
}: {
  bg: string
  bid: number
  debug?: boolean
  profiles: Profile[]
  silver: number
  inPlay: Scheme[]
  userId: string
}): JSX.Element {
  const goldColor = getGoldColor({ bg })
  const silverColor = getSilverColor({ bg })
  const tenInPlay = inPlay.some(scheme => scheme.rank === 10)
  if (debug) {
    console.debug('tenInPlay', tenInPlay)
  }
  const carryingOutTen = tenInPlay && bid >= 10
  if (debug) {
    console.debug('ten', carryingOutTen)
  }
  if (carryingOutTen) {
    return (
      <Text w='max-content'>
        <Text as='span' color={goldColor}>{bid - 10}</Text>
        {' '}
        +
        {' '}
        <Text as='span' color='red'>10</Text>
      </Text>
    )
  }
  const otherProfiles = profiles.filter(profile => profile.userId !== userId)
  const elevenInPlay = inPlay.some(scheme => scheme.rank === 11)
  const carryingOutEleven = elevenInPlay && otherProfiles.some(profile => profile.bid >= 5)
  if (carryingOutEleven) {
    const idealSilver = Math.min(bid, silver)
    const idealGold = bid - idealSilver
    const realGold = Math.ceil(idealGold / 5) * 5
    const realSilver = bid - realGold
    return (
      <Text w='max-content'>
        <Text as='span' color={goldColor}>{realGold}</Text>
        {' '}
        +
        {' '}
        <Text as='span' color={silverColor}>{realSilver}</Text>
      </Text>
    )
  }
  return <Text color={goldColor}>{bid}</Text>
}
