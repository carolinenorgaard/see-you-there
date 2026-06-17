export const formatDateTime = (timestamp: string): string => {
  const now = new Date()
  let date = now
  if (timestamp) date = new Date(timestamp)
  const months = date.getMonth()
  const days = date.getDate()
  // const hours = date.getHours();
  // const minutes = date.getMinutes();
  // const seconds = date.getSeconds();

  const MM = months + 1 < 10 ? `0${months + 1}` : months + 1
  const DD = days < 10 ? `0${days}` : days
  const YYYY = date.getFullYear()
  // const AMPM = hours < 12 ? 'AM' : 'PM';
  // const HH = hours > 12 ? hours - 12 : hours;
  // const MinMin = (minutes < 10) ? `0${minutes}` : minutes;
  // const SS = (seconds < 10) ? `0${seconds}` : seconds;

  return `${MM}/${DD}/${YYYY}`
}

const COPENHAGEN_TZ = 'Europe/Copenhagen'

export const formatDate = (value?: string | null): string =>
  value
    ? new Date(value).toLocaleDateString('da-DK', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: COPENHAGEN_TZ,
      })
    : ''

export const formatTime = (value?: string | null): string =>
  value
    ? new Date(value).toLocaleTimeString('da-DK', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: COPENHAGEN_TZ,
      })
    : ''

export const toIsoDay = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const nextIsoDay = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00.000Z`)
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().slice(0, 10)
}

const copenhagenOffsetMs = (instant: Date): number => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: COPENHAGEN_TZ,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
      .formatToParts(instant)
      .map((p) => [p.type, p.value]),
  )
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  )
  return asUtc - instant.getTime()
}

// Returns YYYY-MM-DD for the given instant as seen in Copenhagen.
export const cphIsoDay = (date: Date): string =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: COPENHAGEN_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)

// Returns the UTC ISO timestamp of midnight in Copenhagen on the given YYYY-MM-DD.
export const cphDayStartUtc = (yyyymmdd: string): string => {
  const probe = new Date(`${yyyymmdd}T00:00:00Z`)
  return new Date(probe.getTime() - copenhagenOffsetMs(probe)).toISOString()
}

export const todayIsoStart = (): string => cphDayStartUtc(cphIsoDay(new Date()))
