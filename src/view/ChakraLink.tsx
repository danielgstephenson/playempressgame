import { Link, LinkProps } from 'react-router-dom'
import { Link as ChakraLink, LinkProps as ChakraLinkProps } from '@chakra-ui/react'

export default function ChakraLinkView (props: LinkProps & ChakraLinkProps): JSX.Element {
  return <ChakraLink as={Link} {...props} />
}
