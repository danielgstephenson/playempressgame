import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/number-input'
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
  function handleChange (value: string): void {
    setBid(Number(value))
  }
  return (
    <>
      <Status label='Bid' value={playerState.bid} />
      <NumberInput
        // step={5}
        // min={playerState.bid}
        // max={playerState.gold}
        value={bid}
        onChange={handleChange}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Cloud
        fn='bid'
        label='Bid'
        props={{ bid, gameId: gameState.id }}
      />
      <Cloud
        fn='imprison'
        label='Imprison'
        props={{ gameId: gameState.id }}
      />
      <Cloud
        fn='buy'
        label='Buy'
        props={{ gameId: gameState.id }}
      />
      <Cloud
        fn='concede'
        label='Concede'
        props={{ gameId: gameState.id }}
      />
      <Cloud
        fn='withdraw'
        label='Withdraw'
        props={{ gameId: gameState.id }}
      />
    </>
  )
}
