import {
  cloneElement,
  CSSProperties,
  isValidElement,
  ReactElement,
  ReactNode,
  Ref,
} from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

/**
 * Combines the ref Slot received with the child's own ref, when the child
 * already had one, so both callers reach the same DOM node.
 */
const composeRefs =
  <T,>(...refs: (Ref<T> | undefined)[]) =>
  (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as { current: T | null }).current = node
    }
  }

/* React 19 moved `ref` into the props object; reading it from `element.ref`
 * is the removed path and would come back undefined. */
type SlotChild = ReactElement<{
  className?: string
  style?: CSSProperties
  ref?: Ref<HTMLElement>
}>

type SlotProps = {
  children: ReactNode
  /** Classes merged with the child's own, the child winning a conflict */
  className?: string
  /** Inline style merged with the child's own, the child winning a conflict */
  style?: CSSProperties
  ref?: Ref<HTMLElement>
  [prop: string]: unknown
}

/**
 * Merges its props onto the single child element instead of rendering its
 * own DOM node — the `asChild` primitive behind `Button`/`Card`. Replaces
 * `@radix-ui/react-slot`: this project only ever passes a single child with
 * no colliding `className`/handlers, so a full Radix-parity implementation
 * (multiple children, `Slottable`, handler chaining) is more than is used.
 *
 * ```tsx
 * <Slot className="btn"><Link to="/orders">See more</Link></Slot>
 * ```
 */
export function Slot({ children, className, style, ref, ...props }: SlotProps) {
  if (!isValidElement(children)) return children ?? null

  const child = children as SlotChild
  const childProps = child.props

  return cloneElement(child, {
    ...props,
    ...childProps,
    className: mergeClasses(className, childProps.className),
    style: { ...style, ...childProps.style },
    ref: composeRefs(ref, childProps.ref),
  })
}
