import { LOGO_MARK_PATH } from './logoMarkPath'

type Props = {
  className?: string
}

export const LogoMark = ({ className }: Props) => (
  <svg viewBox="0 0 32 30" width="32" height="30" fill="currentColor" aria-hidden className={className}>
    <path d={LOGO_MARK_PATH} />
  </svg>
)
