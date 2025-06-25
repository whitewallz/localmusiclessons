type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export default function Button({ children, onClick, loading, disabled, variant = 'primary' }: ButtonProps) {
  const baseClasses = "px-5 py-3 rounded font-semibold transition"
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    secondary: "bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
