type AlertProps = {
  type?: 'info' | 'success' | 'error'
  message: string
}

export default function Alert({ type = 'info', message }: AlertProps) {
  const colors = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  }

  return (
    <div className={`p-4 rounded ${colors[type]} mb-4`}>
      {message}
    </div>
  )
}
