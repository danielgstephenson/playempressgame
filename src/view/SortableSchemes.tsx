import { Dispatch, SetStateAction } from 'react'
import { Scheme } from '../types'
import SchemesContainerView from './SchemesContainer'
import SortablesView from './Sortables'
import SortableScheme from './SortableScheme'

export default function SortableSchemesView ({
  schemes,
  setSchemes
}: {
  schemes: Scheme[]
  setSchemes?: Dispatch<SetStateAction<Scheme[]>>
}): JSX.Element {
  const sortableSchemes = schemes.map((scheme, index) => {
    return (
      <SortableScheme
        key={scheme.id}
        id={scheme.id}
        rank={scheme.rank}
        index={index}
      />
    )
  })
  return (
    <SortablesView
      items={schemes}
      setItems={setSchemes}
    >
      <SchemesContainerView>
        {sortableSchemes}
      </SchemesContainerView>
    </SortablesView>
  )
}
