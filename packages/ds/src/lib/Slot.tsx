import {
  cloneElement,
  CSSProperties,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  Ref,
} from 'react'

import { mergeClasses } from './mergeClasses'

/**
 * Combines a forwarded ref with the single child's own ref (if it has one),
 * so both callers get the DOM node.
 */
function composeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as { current: T | null }).current = node
    }
  }
}

type SlotChild = ReactElement<Record<string, unknown>> & {
  ref?: Ref<HTMLElement>
}

type SlotProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * Merges its props onto the single child element instead of rendering its
 * own DOM node — the `asChild` primitive behind `Button`/`Card`. Replaces
 * `@radix-ui/react-slot`: this project only ever passes a single child with
 * no colliding `className`/handlers, so a full Radix-parity implementation
 * (multiple children, `Slottable`, handler chaining) is more than is used.
 *
 * @example
 * <Slot className="btn"><Link to="/orders">See more</Link></Slot>
 */
export const Slot = forwardRef<HTMLElement, Record<string, unknown>>(
  function Slot(allProps, ref) {
    const { children, className, style, ...props } = allProps as SlotProps &
      Record<string, unknown>

    if (!isValidElement(children)) return children ?? null

    const child = children as SlotChild
    const childProps = child.props

    return cloneElement(child, {
      ...props,
      ...childProps,
      className: mergeClasses(className, childProps.className as string),
      style: { ...style, ...(childProps.style as object) },
      ref: composeRefs(ref, child.ref),
    })
  }
)

Slot.displayName = 'Slot'
