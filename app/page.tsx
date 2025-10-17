'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Building2, Users, FolderKanban, Loader2 } from 'lucide-react'
import type { ClientWithRelations } from '@/types'

export default function HomePage() {
  const [clients, setClients] = useState<ClientWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/clients')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch clients')
        return res.json()
      })
      .then(data => {
        setClients(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading clients:', error)
        setError(error.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des clients...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de connexion</h2>
          <p className="text-gray-600 mb-4">
            Impossible de charger les données. Vérifiez que la base de données est configurée.
          </p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Outils d&apos;Aide à la Décision
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Plateforme de priorisation de backlog multi-clients
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Administration
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clients actifs</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FolderKanban className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Projets totaux</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.reduce((acc, client) => acc + (client._count?.projects || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.reduce((acc, client) => acc + (client._count?.users || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Clients Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vos clients</h2>

          {clients.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun client</h3>
              <p className="mt-2 text-sm text-gray-600">
                Commencez par créer votre premier client depuis l&apos;administration.
              </p>
              <div className="mt-6">
                <Link
                  href="/admin/clients/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                >
                  Créer un client
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map(client => (
                <Link
                  key={client.id}
                  href={`/clients/${client.slug}`}
                  className="block"
                >
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-100 hover:border-blue-300 group">
                    {/* Client header with color */}
                    <div
                      className="h-3"
                      style={{ backgroundColor: client.couleurPrimaire }}
                    />

                    <div className="p-6">
                      {/* Logo or Initial */}
                      <div className="flex items-center mb-4">
                        {client.logo ? (
                          <Image
                            src={client.logo}
                            alt={client.nom}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-lg object-contain"
                          />
                        ) : (
                          <div
                            className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: client.couleurPrimaire }}
                          >
                            {client.nom.charAt(0)}
                          </div>
                        )}
                        <div className="ml-3">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {client.nom}
                          </h3>
                          <p className="text-sm text-gray-500">@{client.slug}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <FolderKanban className="h-4 w-4 mr-1" />
                          <span>{client._count?.projects || 0} projets</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{client._count?.users || 0} utilisateurs</span>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className="mt-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {client.statut}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            © 2025 Outils d&apos;Aide à la Décision - Développé avec Next.js & Prisma
          </p>
        </div>
      </footer>
    </div>
  )
}
