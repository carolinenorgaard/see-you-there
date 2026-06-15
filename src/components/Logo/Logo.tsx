import clsx from 'clsx'

import { LogoMark } from './LogoMark'

interface Props {
  className?: string
  /** Hide the "See you there" wordmark and render only the icon. */
  iconOnly?: boolean
  /** Use the light-color variant (white text) — for permanently dark surfaces like the footer. */
  light?: boolean
}

export const Logo = ({ className, iconOnly = false, light = false }: Props) => (
  <span
    className={clsx(
      'inline-flex items-center gap-2',
      light ? 'text-white' : 'text-black dark:text-white',
      className,
    )}
    aria-label="See you there"
  >
    <LogoMark className="text-brand-teal" />
    {!iconOnly && (
      <span className="text-base font-bold tracking-tight">See you there</span>
    )}
  </span>
)
