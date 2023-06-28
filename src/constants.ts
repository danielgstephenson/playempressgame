import { defaultDropAnimationSideEffects } from '@dnd-kit/core'

export const SCHEME_WIDTH = 'min(19vw, 94px)'
export const SCHEME_RATIO = '747/1112'
export const DROP_ANIMATION = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4'
      }
    }
  })
}
