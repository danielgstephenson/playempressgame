import { Text } from '@chakra-ui/react'
import { Scheme } from '../types'
import TinySchemeView from './TinyScheme'
import SchemesContainerView from './SchemesContainer'

export default function StaticCircleSchemesView ({
  schemes
}: {
  schemes?: Scheme[]
}): JSX.Element {
  if (schemes == null || schemes.length === 0) {
    return <Text>Empty</Text>
  }
  const views = schemes?.map(scheme =>
    <TinySchemeView rank={scheme.rank} key={scheme.id} />
  )
  return <SchemesContainerView>{views}</SchemesContainerView>
}
