export const metadata = {
  title: 'Admin — C&H Prestige',
}

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  )
}
