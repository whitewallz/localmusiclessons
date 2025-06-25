type CardProps = {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded shadow hover:shadow-lg transition ${className}`}>
      {children}
    </div>
  )
}
