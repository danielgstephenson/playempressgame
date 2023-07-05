import { Center, CenterProps } from '@chakra-ui/react'
import { SCHEME_RATIO } from '../constants'

export default function TinySchemeCenterView ({
  children,
  ...restProps
}: {
  children?: React.ReactNode
} & CenterProps): JSX.Element {
  return (
    <Center p='0.05px' sx={{ aspectRatio: SCHEME_RATIO }} w='18px' minH='24px' h='100%' {...restProps}>
      {children}
    </Center>
  )
}
