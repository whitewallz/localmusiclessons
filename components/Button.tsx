type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary'
  className?: string
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
}: ButtonProps) {
  const base = 'px-5 py-3 rounded font-semibold transition'
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-300 hover:bg-gray-400',
  }

  return (
    <button type={type} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  )
}
