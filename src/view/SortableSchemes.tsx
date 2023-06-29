import { CardProps } from '@chakra-ui/card'
import { Scheme } from '../types'
import SchemesContainerView from './SchemesContainer'
import SortableSchemeView from './SortableScheme'

export default function SortableSchemesView ({
  schemes
}: {
  schemes: Scheme[]
} & CardProps): JSX.Element {
  const sortableSchemes = schemes?.map((scheme, index) => {
    return (
      <SortableSchemeView
        key={scheme.id}
        id={scheme.id}
        rank={scheme.rank}
      />
    )
  })

  return <SchemesContainerView>{sortableSchemes}</SchemesContainerView>
};
