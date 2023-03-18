import { ReactNode } from 'react'
import CardGroupView from './CardGroup'

export default function CardStackView ({
  label,
  children,
  cardGroup
}: {
  label: string
  children?: ReactNode
  cardGroup?: number[]
}): JSX.Element {
  return (
    <CardGroupView label={label} cardGroup={cardGroup}>
      {children}
    </CardGroupView>
  )
}
