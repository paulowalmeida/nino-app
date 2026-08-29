import {
  closestCorners,
  type CollisionDetection,
  pointerWithin,
} from '@dnd-kit/core'

/**
 * Pointer drops follow the whole region under the cursor. The corner fallback
 * keeps keyboard dragging functional, since it has no pointer coordinates.
 */
export const kitchenCollision: CollisionDetection = (arguments_) => {
  const pointerCollisions = pointerWithin(arguments_)

  return pointerCollisions.length
    ? pointerCollisions
    : closestCorners(arguments_)
}
