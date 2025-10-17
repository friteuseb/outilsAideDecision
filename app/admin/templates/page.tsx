'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Loader2, LayoutTemplate, Edit, Trash2 } from 'lucide-react'

type Template = {
  id: string
  titre: string
  categorie: string
  description: string
  budget: number
  delaiSemaines: number
  kpi: string
  secteur: string | null
  _count?: {
    projects: number
  }
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then(data => {
        setTemplates(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading templates:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des templates...</p>
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
                href="/admin"
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
                <p className="mt-1 text-sm text-gray-600">
                  {templates.length} templates disponibles
                </p>
              </div>
            </div>
            <Link
              href="/admin/templates/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau template
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {templates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <LayoutTemplate className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun template</h3>
            <p className="mt-2 text-sm text-gray-600">
              Créez votre premier template de projet réutilisable.
            </p>
            <div className="mt-6">
              <Link
                href="/admin/templates/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer un template
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(template => (
              <div
                key={template.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-100"
              >
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2" />

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {template.titre}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {template.categorie}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-700 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Budget:</span>
                      <span className="font-semibold">{template.budget.toLocaleString()}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Délai:</span>
                      <span className="font-semibold">{template.delaiSemaines} semaines</span>
                    </div>
                    {template.secteur && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Secteur:</span>
                        <span className="font-semibold">{template.secteur}</span>
                      </div>
                    )}
                    {template._count && (
                      <div className="flex justify-between pt-2 border-t border-gray-100">
                        <span className="text-gray-500">Utilisé:</span>
                        <span className="font-semibold text-purple-600">
                          {template._count.projects} fois
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      <Edit className="w-4 h-4 inline mr-1" />
                      Modifier
                    </button>
                    <button
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
