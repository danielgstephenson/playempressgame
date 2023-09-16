import { Heading } from '@chakra-ui/react'
import HeaderView from '../Header'

export default function HomePageView (): JSX.Element {
  return (
    <>
      <HeaderView />
      <Heading size='xl'>Long Live the Empress</Heading>
      <Heading size='md'>Every monarch has blood on their hands</Heading>
    </>
  )
}
