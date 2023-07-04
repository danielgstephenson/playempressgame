import { VStack, StackProps } from '@chakra-ui/react'
import { ReactNode } from 'react'
import PlayerGoldView from './PlayerGold'
import PlayerSilverView from './PlayerSilver'

export default function ReadyContainerView ({
  children,
  ...restProps
}: {
  children?: ReactNode
} & StackProps): JSX.Element {
  return (
    <VStack {...restProps}>
      <PlayerGoldView />
      <PlayerSilverView />
      {children}
    </VStack>
  )
}
