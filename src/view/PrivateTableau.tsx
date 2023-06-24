import { Heading } from '@chakra-ui/react'
import { useContext } from 'react'
import { playerContext } from '../reader/player'
import StaticSchemesView from './StaticSchemes'

export default function PrivateTableauView (): JSX.Element {
  const playerState = useContext(playerContext)
  return (
    <>
      <Heading size='sm'>Tableau:</Heading>
      <StaticSchemesView
        schemes={playerState.tableau}
      />
    </>
  )
}
