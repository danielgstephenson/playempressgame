import { Center, CenterProps } from '@chakra-ui/react'

export default function TinySchemeCenterView ({
  children,
  ...restProps
}: {
  children?: React.ReactNode
} & CenterProps): JSX.Element {
  return (
    <Center p='2px' minH='24px' h='100%' {...restProps}>
      {children}
    </Center>
  )
}
