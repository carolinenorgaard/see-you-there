import clsx from 'clsx'

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
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/logo.svg" alt="See you there" width={32} height={30} />
    {!iconOnly && (
      <span className="text-base font-bold tracking-tight">See you there</span>
    )}
  </span>
)
