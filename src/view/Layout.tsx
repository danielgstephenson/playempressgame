import { Container } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import HeaderView from './Header'

export default function LayoutView (): JSX.Element {
  return (
    <Container
      display='flex'
      flexDirection='column'
      height='100%'
      p='5px'
      gap='5px'
    >
      <HeaderView />
      <Outlet />
    </Container>
  )
}
