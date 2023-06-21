import { Text } from '@chakra-ui/react'
import { Scheme } from '../types'
import SchemeView from './Scheme'
import SchemesContainerView from './SchemesContainer'

export default function StaticSchemesView ({
  schemes
}: {
  schemes?: Scheme[]
}): JSX.Element {
  if (schemes == null || schemes.length === 0) {
    return <Text>Empty</Text>
  }
  const views = schemes?.map(scheme =>
    <SchemeView rank={scheme.rank} key={scheme.id} />
  )
  return <SchemesContainerView>{views}</SchemesContainerView>
}
