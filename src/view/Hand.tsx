import React, { Fragment, useContext } from 'react'
import {
  SortableContext
} from '@dnd-kit/sortable'

import SchemesContainerView from './SchemesContainer'
import HandSchemeView from './HandScheme'
import playContext from '../context/play'
import { Heading } from '@chakra-ui/react'

export default function HandView (): JSX.Element {
  const {
    hand, trashSchemeId, playSchemeId
  } = useContext(playContext)
  const sortableItems = hand?.map((scheme) => {
    if (scheme.id === trashSchemeId || scheme.id === playSchemeId) {
      return <Fragment key={scheme.id} />
    }
    return (
      <HandSchemeView key={scheme.id} id={scheme.id} />
    )
  })

  if (hand == null) {
    return <></>
  }

  return (
    <>
      <Heading size='sm' textAlign='center'>Hand</Heading>
      <SortableContext items={hand}>
        <SchemesContainerView justifyContent='center'>
          {sortableItems}
        </SchemesContainerView>
      </SortableContext>
    </>
  )
}
