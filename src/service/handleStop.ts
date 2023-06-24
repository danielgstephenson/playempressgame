import { MouseEvent } from 'react'

export default function handleStop (
  event: MouseEvent<HTMLButtonElement>
): void {
  console.log('stop')
  event.preventDefault()
  event.stopPropagation()
}
