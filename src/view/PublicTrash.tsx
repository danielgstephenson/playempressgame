import { Heading } from '@chakra-ui/react'
import PublicTrashCirclesView from './PublicTrashCirclesView'

export default function PublicTrashView (): JSX.Element {
  return (
    <>
      <Heading size='sm'>Trash:</Heading>
      <PublicTrashCirclesView />
    </>
  )
}
