'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Building2,
  Users,
  FolderKanban,
  Plus,
  Edit,
  Trash2,
  Loader2,
  ArrowLeft,
  LayoutTemplate
} from 'lucide-react'
import type { ClientWithRelations } from '@/types'

export default function AdminPage() {
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

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.')) {
      return
    }

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete client')
      }

      setClients(clients.filter(c => c.id !== clientId))
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('Erreur lors de la suppression du client')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Gestion des clients, projets et templates
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/clients/new"
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <Building2 className="h-12 w-12 opacity-90 group-hover:opacity-100" />
              <Plus className="h-8 w-8 opacity-75" />
            </div>
            <h3 className="text-xl font-bold mb-2">Nouveau Client</h3>
            <p className="text-blue-100 text-sm">Créer un nouveau client avec sa configuration</p>
          </Link>

          <Link
            href="/admin/templates"
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <LayoutTemplate className="h-12 w-12 opacity-90 group-hover:opacity-100" />
              <Plus className="h-8 w-8 opacity-75" />
            </div>
            <h3 className="text-xl font-bold mb-2">Templates</h3>
            <p className="text-purple-100 text-sm">Gérer les templates de projets réutilisables</p>
          </Link>

          <Link
            href="/admin/users"
            className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="h-12 w-12 opacity-90 group-hover:opacity-100" />
              <Plus className="h-8 w-8 opacity-75" />
            </div>
            <h3 className="text-xl font-bold mb-2">Utilisateurs</h3>
            <p className="text-green-100 text-sm">Gérer les utilisateurs et leurs accès</p>
          </Link>
        </div>

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

        {/* Clients List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900">Clients</h2>
          </div>

          {clients.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun client</h3>
              <p className="mt-2 text-sm text-gray-600">
                Commencez par créer votre premier client.
              </p>
              <div className="mt-6">
                <Link
                  href="/admin/clients/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un client
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Projets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateurs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {client.logo ? (
                            <Image
                              src={client.logo}
                              alt={client.nom}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-lg object-contain"
                            />
                          ) : (
                            <div
                              className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold"
                              style={{ backgroundColor: client.couleurPrimaire }}
                            >
                              {client.nom.charAt(0)}
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {client.nom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {client.domaine || 'Aucun domaine'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono">
                          {client.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {client._count?.projects || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {client._count?.users || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {client.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/clients/${client.slug}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FolderKanban className="w-5 h-5" />
                          </Link>
                          <Link
                            href={`/admin/clients/${client.id}/edit`}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClient(client.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            Administration - Outils d&apos;Aide à la Décision
          </p>
        </div>
      </footer>
    </div>
  )
}
