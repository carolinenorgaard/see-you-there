export const FormError = ({ message }: { message?: string | null }) =>
  message ? <p className="text-destructive text-sm">{message}</p> : null
