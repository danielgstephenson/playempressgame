import { VStack } from '@chakra-ui/react'
import { ReactNode } from 'react'
import PlayerGoldView from './PlayerGold'
import PlayerSilverView from './PlayerSilver'

export default function ReadyContainerView ({
  children
}: {
  children?: ReactNode
}): JSX.Element {
  return (
    <VStack>
      <PlayerGoldView />
      <PlayerSilverView />
      {children}
    </VStack>
  )
}
