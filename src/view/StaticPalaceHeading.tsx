import { Heading, HStack, Text } from '@chakra-ui/react'

export default function StaticPalaceHeadingView ({
  label,
  children
}: {
  label: string
  children?: JSX.Element
}): JSX.Element {
  return (
    <Heading size='sm'>
      <HStack alignItems='center'>
        <Text>{label}</Text>
        {children}
      </HStack>
    </Heading>
  )
}
