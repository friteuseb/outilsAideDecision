'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    slug: '',
    domaine: '',
    logo: '',
    couleurPrimaire: '#3B82F6',
    couleurSecondaire: '#1E40AF',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-generate slug from nom
    if (name === 'nom' && !formData.slug) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du client')
      }

      const client = await response.json()
      router.push(`/clients/${client.slug}`)
    } catch (error) {
      console.error('Error creating client:', error)
      alert('Erreur lors de la création du client')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nouveau Client</h1>
              <p className="mt-1 text-sm text-gray-600">
                Créer un nouveau client avec sa configuration
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            {/* Nom */}
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                Nom du client <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                required
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Acme Corporation"
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                placeholder="acme"
                pattern="[a-z0-9-]+"
              />
              <p className="mt-1 text-sm text-gray-500">
                Utilisé dans l&apos;URL : /clients/{formData.slug || 'slug'}
              </p>
            </div>

            {/* Domaine */}
            <div>
              <label htmlFor="domaine" className="block text-sm font-medium text-gray-700 mb-2">
                Domaine (optionnel)
              </label>
              <input
                type="text"
                id="domaine"
                name="domaine"
                value={formData.domaine}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="www.acme.com"
              />
            </div>

            {/* Logo URL */}
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                URL du logo (optionnel)
              </label>
              <input
                type="url"
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://exemple.com/logo.png"
              />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="couleurPrimaire" className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur primaire
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    id="couleurPrimaire"
                    name="couleurPrimaire"
                    value={formData.couleurPrimaire}
                    onChange={handleChange}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.couleurPrimaire}
                    onChange={(e) => setFormData(prev => ({ ...prev, couleurPrimaire: e.target.value }))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="couleurSecondaire" className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur secondaire
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    id="couleurSecondaire"
                    name="couleurSecondaire"
                    value={formData.couleurSecondaire}
                    onChange={handleChange}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.couleurSecondaire}
                    onChange={(e) => setFormData(prev => ({ ...prev, couleurSecondaire: e.target.value }))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    placeholder="#1E40AF"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Aperçu</h3>
              <div
                className="p-6 rounded-lg"
                style={{
                  background: `linear-gradient(to right, ${formData.couleurPrimaire}, ${formData.couleurSecondaire})`
                }}
              >
                <div className="bg-white rounded-lg p-4 shadow-lg">
                  <h4 className="text-xl font-bold" style={{ color: formData.couleurPrimaire }}>
                    {formData.nom || 'Nom du client'}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.domaine || 'www.exemple.com'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/admin"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Créer le client
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
