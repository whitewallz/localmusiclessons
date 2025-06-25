type CardProps = {
  title: string
  subtitle?: string
  imageUrl?: string
  children?: React.ReactNode
  onClick?: () => void
}

export default function Card({ title, subtitle, imageUrl, children, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded shadow-md hover:shadow-lg cursor-pointer overflow-hidden transition p-4"
    >
      {imageUrl && (
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover rounded mb-4" />
      )}
      <h2 className="text-xl font-semibold">{title}</h2>
      {subtitle && <p className="text-gray-600 dark:text-gray-300 mb-2">{subtitle}</p>}
      {children}
    </div>
  )
}
