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
  HStack
} from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import Cloud from './Cloud'
import Status from './Status'

export default function BidView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const [bid, setBid] = useState(playerState.bid)
  useEffect(() => {
    setBid(playerState.bid)
  }, [playerState.bid])
  if (playerState.bid == null || bid == null || gameState.phase !== 'auction') {
    return <></>
  }
  function handleChange (value: string): void {
    setBid(Number(value))
  }
  function handleSliderChange (
    values: number[]
  ): void {
    if (playerState.bid == null) {
      return
    }
    const bid = values[0]
    if (bid >= playerState.bid) {
      setBid(bid)
    }
  }
  return (
    <>
      <HStack spacing='20px'>
        <Status label='Bid' value={playerState.bid} />
        <RangeSlider
          onChange={handleSliderChange}
          value={[bid]}
          min={0}
          max={playerState.gold}
          step={5}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb boxSize={6} index={0} />
        </RangeSlider>
        <NumberInput
          step={5}
          min={playerState.bid}
          max={playerState.gold}
          value={bid}
          onChange={handleChange}
          width='100px'
          size='xs'
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
      <Cloud
        fn='bid'
        props={{ bid, gameId: gameState.id }}
      >
        Bid
      </Cloud>
      <Cloud
        fn='imprison'
        props={{ gameId: gameState.id }}
      >
        Imprison
      </Cloud>
      <Cloud
        fn='concede'
        props={{ gameId: gameState.id }}
      >
        Concede
      </Cloud>
      <Cloud
        fn='withdraw'
        props={{ gameId: gameState.id }}
      >
        Withdraw
      </Cloud>
    </>
  )
}
