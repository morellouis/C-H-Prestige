import AdminNavbar from '@/components/admin/AdminNavbar'
import ListeMessages from '@/components/admin/ListeMessages'
import { getMessages } from '@/lib/messages'

export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
  let messages = []
  try {
    messages = await getMessages()
  } catch {
    // Supabase pas encore configuré ou table absente
  }

  return (
    <div>
      <AdminNavbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">
          Messages reçus
          {messages.filter(m => !m.lu).length > 0 && (
            <span className="ml-3 inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {messages.filter(m => !m.lu).length} non lu(s)
            </span>
          )}
        </h1>

        {messages.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            Aucun message pour le moment.
          </div>
        ) : (
          <ListeMessages messages={messages} />
        )}
      </main>
    </div>
  )
}
