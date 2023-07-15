import { Button, HStack, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'
import PopoverMessageView from './PopoverMessage'

export default function ScorePopoverView ({ children, score, icon }: {
  children: ReactNode
  score: number
  icon: JSX.Element
}): JSX.Element {
  const trigger = (
    <Button>
      <HStack>
        {icon}
        <Text>{score}</Text>
      </HStack>
    </Button>
  )
  return (
    <PopoverMessageView trigger={trigger}>
      {children}
    </PopoverMessageView>
  )
}
