import { ReactNode } from 'react'

export default function Curtain ({
  children,
  open,
  openElement = <></>,
  closedElement = <></>
}: {
  children?: ReactNode
  open: boolean
  openElement?: JSX.Element
  closedElement?: JSX.Element
}): JSX.Element {
  const element = open ? openElement : closedElement
  return (
    <>
      {children}
      {element}
    </>
  )
}
