import { HStack, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'
import PopoverButtonView from './PopoverButton'

export default function ScorePopoverView ({ children, score, icon }: {
  children: ReactNode
  score: number
  icon: JSX.Element
}): JSX.Element {
  return (
    <PopoverButtonView
      label={
        <HStack>
          {icon}
          <Text>{score}</Text>
        </HStack>
      }
    >
      {children}
    </PopoverButtonView>
  )
}
