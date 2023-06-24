import { MouseEvent } from 'react'

export default function handleStop (
  event: MouseEvent<HTMLButtonElement>
): void {
  event.preventDefault()
  event.stopPropagation()
}
