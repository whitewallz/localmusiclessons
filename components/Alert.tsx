import { useState } from 'react'

type AlertProps = {
  message: string
  type?: 'info' | 'success' | 'error'
}

export default function Alert({ message, type = 'info' }: AlertProps) {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  const colors = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  }

  return (
    <div className={`p-4 rounded mb-4 flex justify-between items-center ${colors[type]}`}>
      <p>{message}</p>
      <button
        onClick={() => setVisible(false)}
        className="font-bold text-xl leading-none"
        aria-label="Dismiss alert"
      >
        &times;
      </button>
    </div>
  )
}
