import { LockIcon } from '@chakra-ui/icons'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  RangeSlider,
  RangeSliderThumb,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  HStack,
  Box
} from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import getBid from '../service/getBid'
import getHighestUntiedProfile from '../service/getHighestUntiedProfile'
import isTied from '../service/isTied'
import useBidMax from '../use/bidMax'
import BidStatusView from './BidStatus'
import Cloud from './Cloud'
import Curtain from './Curtain'
import PopoverIconButtonView from './PopoverIconButton'
import Status from './Status'

export default function BidView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const [bid, setBid] = useState(playerState.bid)
  useEffect(() => {
    setBid(playerState.bid)
  }, [playerState.bid])
  const allReady = gameState.profiles?.every(profile => profile.auctionReady)
  const max = useBidMax()
  if (
    playerState.bid == null ||
    bid == null ||
    gameState.phase !== 'auction' ||
    allReady === true ||
    playerState.inPlay == null ||
    gameState.profiles == null ||
    playerState.silver == null ||
    playerState.userId == null ||
    playerState.lastBidder == null
  ) {
    return <></>
  }
  function handleChange (value: string): void {
    if (playerState.silver == null || playerState.gold == null) return
    const newBid = Number(value)
    const safeBid = getBid({ newBid, gold: playerState.gold, oldBid: bid, silver: playerState.silver })
    setBid(safeBid)
  }
  function handleSliderChange (
    values: number[]
  ): void {
    if (playerState.bid == null || playerState.silver == null || playerState.gold == null) {
      return
    }
    const newBid = values[0]
    if (newBid >= playerState.bid) {
      const safeBid = getBid({ newBid, gold: playerState.gold, oldBid: bid, silver: playerState.silver })
      setBid(safeBid)
    }
  }
  const eleven = playerState.inPlay.some(scheme => scheme.rank === 11)
  const bidFive = gameState.profiles.some(profile => profile.userId !== playerState.userId && profile.bid >= 5)
  const step = eleven && bidFive ? 1 : 5
  const bidStatus = (
    <BidStatusView
      bg='gray.800'
      inPlay={playerState.inPlay}
      bid={playerState.bid}
      profiles={gameState.profiles}
      silver={playerState.silver}
      userId={playerState.userId}
    />
  )
  const showControls = playerState.auctionReady === false
  const tied = isTied({ profiles: gameState.profiles, bid: playerState.bid })
  const imprisoning = tied && playerState.auctionReady
  const highestUntiedProfile = getHighestUntiedProfile(gameState.profiles)
  const showBid = bid > playerState.bid
  const showConcede = highestUntiedProfile != null && highestUntiedProfile.userId !== playerState.userId
  const showWithdraw = playerState.bid > 0 && tied && !playerState.lastBidder
  const showImprison = gameState.profiles.every(profile => profile.bid === bid)
  return (
    <>
      <HStack spacing='20px' justifyContent='space-between'>
        <Curtain open={imprisoning}>
          <PopoverIconButtonView
            aria-label='You are ready to imprison.'
            size='xs'
            bg='gray'
            color='black'
            icon={<LockIcon />}
          >
            You are ready to imprison.
          </PopoverIconButtonView>
        </Curtain>
        <Curtain open={showControls}>
          <NumberInput
            step={step}
            min={playerState.bid}
            max={max}
            value={bid}
            onChange={handleChange}
            width='120px'
            size='xs'
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <RangeSlider
            onChange={handleSliderChange}
            value={[bid]}
            min={0}
            max={max}
            step={step}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb boxSize={6} index={0} />
          </RangeSlider>
        </Curtain>
        <Status label='Bid'>{bidStatus}</Status>
      </HStack>
      <Curtain open={showControls}>
        <HStack justifyContent='space-between' flexDirection='row-reverse'>
          <Curtain open={showConcede}>
            <Cloud
              fn='concede'
              props={{ gameId: gameState.id }}
            >
              Concede
            </Cloud>
          </Curtain>
          <Curtain open={showWithdraw}>
            <Cloud
              fn='withdraw'
              props={{ gameId: gameState.id }}
            >
              Withdraw
            </Cloud>
          </Curtain>
          <Curtain open={showImprison}>
            <Cloud
              fn='imprison'
              props={{ gameId: gameState.id }}
            >
              Imprison
            </Cloud>
          </Curtain>
          <Curtain open={showBid}>
            <Box mr='auto'>
              <Cloud
                fn='bid'
                props={{ bid, gameId: gameState.id }}
              >
                Bid
              </Cloud>
            </Box>
          </Curtain>
        </HStack>
      </Curtain>
    </>
  )
}
