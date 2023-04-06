import { ReactNode } from 'react'
import { Scheme } from '../types'
import CardGroupView from './CardGroup'

export default function CardStackView ({
  label,
  children,
  cardGroup
}: {
  label: string
  children?: ReactNode
  cardGroup?: Scheme[]
}): JSX.Element {
  return (
    <CardGroupView label={label} cardGroup={cardGroup}>
      {children}
    </CardGroupView>
  )
}
