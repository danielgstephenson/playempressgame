import { ButtonProps } from '@chakra-ui/react'
import { useContext } from 'react'
import profileContext from '../context/profile'
import { gameContext } from '../reader/game'
import areAllReady from '../service/areAllReady'
import getBg from '../service/getBg'
import getHighestUntiedProfile from '../service/getHighestUntiedProfile'
import isTaking from '../service/isTaking'
import { Profile } from '../types'
import GridButton from './GridButton'

export default function InPlaySchemeButtonView ({
  rank,
  ...restProps
}: {
  rank: number
} & ButtonProps): JSX.Element {
  const profileState = useContext(profileContext)
  const gameState = useContext(gameContext)
  const bg = getBg({ rank })
  const allReady = areAllReady(gameState.profiles)
  const highestUntiedProfile = getHighestUntiedProfile(gameState)
  const highestUntiedBidder = highestUntiedProfile?.userId === profileState.userId
  if (profileState.bid == null || gameState.profiles == null || profileState.userId == null) {
    return <></>
  }
  if (rank === 9) {
    if (allReady) {
      if (highestUntiedBidder) {
        return (
          <GridButton {...restProps} bg='gray' color={bg}>{rank}</GridButton>
        )
      }
      return (
        <GridButton {...restProps} bg='red'>{rank}</GridButton>
      )
    }
    return (
      <GridButton {...restProps} bg='white' color='red'>{rank}</GridButton>
    )
  }
  if (rank === 10) {
    if (!allReady) {
      if (profileState.bid >= 10) {
        return (
          <GridButton {...restProps} bg='red' _hover={{ bg }} color='white'>{rank}</GridButton>
        )
      } else {
        return (
          <GridButton {...restProps} bg='white' color='red'>{rank}</GridButton>
        )
      }
    }
  }
  if (rank === 11) {
    if (!allReady) {
      const highestOtherBidder = gameState.profiles.reduce<{ bid: number, profile: Profile }>((highestBidder, profile) => {
        if (profile.userId === profileState.userId) {
          return highestBidder
        }
        if (profile.bid > highestBidder.bid) {
          return { bid: profile.bid, profile }
        }
        return highestBidder
      }, { bid: 0, profile: gameState.profiles[0] }).profile
      if (highestOtherBidder != null && highestOtherBidder.bid >= 5) {
        return (
          <GridButton {...restProps} bg='red' _hover={{ bg }} color='white'>{rank}</GridButton>
        )
      } else {
        return (
          <GridButton {...restProps} bg='white' color='red'>{rank}</GridButton>
        )
      }
    }
  }
  if (rank === 12) {
    if (!allReady) {
      return (
        <GridButton {...restProps} bg='white' color='red'>{rank}</GridButton>
      )
    }
    const taking = isTaking({ game: gameState, userId: profileState.userId })
    if (!taking || gameState.dungeon?.length === 0) {
      return (
        <GridButton {...restProps} bg='gray' color={bg}>{rank}</GridButton>
      )
    }
    return (
      <GridButton {...restProps} bg='red' _hover={{ bg }} color='white'>{rank}</GridButton>
    )
  }
  if (rank === 13) {
    if (!allReady) {
      return (
        <GridButton {...restProps} bg='white' color='red'>{rank}</GridButton>
      )
    }
    const taking = isTaking({ game: gameState, userId: profileState.userId })
    if (taking || highestUntiedProfile?.topDiscardScheme == null) {
      return (
        <GridButton {...restProps} bg='gray' color={bg}>{rank}</GridButton>
      )
    }
    return (
      <GridButton {...restProps} bg='red' _hover={{ bg }} color='white'>{rank}</GridButton>
    )
  }
  return <GridButton {...restProps} bg={bg}>{rank}</GridButton>
}
