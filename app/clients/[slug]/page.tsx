'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Search, Settings2, Loader2 } from 'lucide-react'
import type { Client, ProjectWithRelations } from '@/types'
import { formatCurrency, calculateBudgetScore } from '@/lib/utils'

type WeightConfig = {
  [key: string]: number
}

type ProjectScores = {
  [key: string]: number
}

export default function ClientBacklogPage() {
  const params = useParams()
  const slug = params.slug as string

  const [client, setClient] = useState<Client | null>(null)
  const [projects, setProjects] = useState<ProjectWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [budgetDisponible, setBudgetDisponible] = useState(50000)

  // Weights for scoring
  const [weights, setWeights] = useState<WeightConfig>({
    impactBusiness: 50,
    complexite: 25,
    budgetScore: 25
  })

  // Load client data
  useEffect(() => {
    Promise.all([
      fetch(`/api/clients?slug=${slug}`).then(res => res.json()),
      fetch(`/api/clients/${slug}/projects`).then(res => res.json())
    ])
      .then(([clientData, projectsData]) => {
        if (Array.isArray(clientData) && clientData.length > 0) {
          setClient(clientData[0])
        }
        setProjects(projectsData)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading data:', error)
        setLoading(false)
      })
  }, [slug])

  // Calculate project score
  const calculateScore = (project: ProjectWithRelations): number => {
    const scores = project.scores as ProjectScores
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)

    if (totalWeight === 0) return 0

    // Complexité inversée (moins c'est complexe, mieux c'est)
    const complexiteInversee = 11 - (scores.complexite || 5)

    // Score du budget calculé dynamiquement
    const budgetScore = calculateBudgetScore(project.budget)

    const rawScore = (
      (scores.impactBusiness || 5) * weights.impactBusiness +
      complexiteInversee * weights.complexite +
      budgetScore * weights.budgetScore
    )

    return rawScore / totalWeight
  }

  // Get priority label and color
  const getPriority = (score: number) => {
    if (score >= 8.5) return { label: 'CRITIQUE', color: 'bg-red-100 text-red-800 border-red-300' }
    if (score >= 7) return { label: 'HAUTE', color: 'bg-orange-100 text-orange-800 border-orange-300' }
    if (score >= 5.5) return { label: 'MOYENNE', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' }
    return { label: 'FAIBLE', color: 'bg-gray-100 text-gray-800 border-gray-300' }
  }

  // Sorted projects with scores
  const sortedProjects = useMemo(() => {
    return projects
      .map(p => ({ ...p, score: calculateScore(p) }))
      .filter(p =>
        searchTerm === '' ||
        p.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => b.score - a.score)
  }, [projects, weights, searchTerm])

  // Selection stats
  const selectionStats = useMemo(() => {
    const selected = sortedProjects.filter(p => selectedProjects.includes(p.id))
    const totalBudget = selected.reduce((sum, p) => sum + p.budget, 0)
    const totalDelai = selected.reduce((sum, p) => sum + p.delaiSemaines, 0)

    return {
      count: selected.length,
      projects: selected,
      totalBudget,
      budgetRestant: budgetDisponible - totalBudget,
      pourcentageUtilise: budgetDisponible > 0 ? (totalBudget / budgetDisponible) * 100 : 0,
      totalDelai: totalDelai
    }
  }, [selectedProjects, sortedProjects, budgetDisponible])

  // Total budget of all projects
  const totalBudget = useMemo(() => {
    return projects.reduce((sum, p) => sum + p.budget, 0)
  }, [projects])

  // Toggle project selection
  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  // Update project criteria
  const updateProjectCriteria = (id: string, field: string, value: number) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newScores = { ...(p.scores as ProjectScores), [field]: value }
          return { ...p, scores: newScores }
        }
        return p
      })
    )
  }

  // Update weight
  const updateWeight = (field: string, value: number) => {
    setWeights(prev => ({ ...prev, [field]: value }))
  }

  // Export CSV
  const exportCSV = () => {
    const headers = ['Rang', 'ID', 'Projet', 'Catégorie', 'Description', 'Score', 'Priorité', 'Impact Business', 'Complexité', 'Budget', 'Délai', 'KPI']
    const rows = sortedProjects.map((p, idx) => {
      const scores = p.scores as ProjectScores
      return [
        idx + 1,
        p.id.substring(0, 8),
        `"${p.titre}"`,
        `"${p.categorie}"`,
        `"${p.description}"`,
        p.score.toFixed(2),
        getPriority(p.score).label,
        scores.impactBusiness || 5,
        scores.complexite || 5,
        p.budget,
        p.delaiSemaines,
        `"${p.kpi}"`
      ]
    })
    const csv = [headers, ...rows].map(row => row.join(',')).join('\\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${slug}_backlog_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // Export selection
  const exportSelection = () => {
    if (selectionStats.count === 0) {
      alert('Aucun projet sélectionné')
      return
    }
    const headers = ['Rang', 'Projet', 'Score', 'Budget', 'Délai', 'Description']
    const rows = selectionStats.projects.map((p, idx) => [
      idx + 1,
      `"${p.titre}"`,
      p.score.toFixed(2),
      p.budget,
      p.delaiSemaines,
      `"${p.description}"`
    ])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${slug}_selection_${selectionStats.count}projets_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du backlog...</p>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Client introuvable</h2>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(to bottom right, ${client.couleurPrimaire}10, ${client.couleurSecondaire}10)`
      }}
    >
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              {client.logo && (
                <img src={client.logo} alt={client.nom} className="h-10" />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{client.nom}</h1>
                <p className="text-sm text-gray-600">
                  {sortedProjects.length} projets • Budget total : {formatCurrency(totalBudget)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selection Summary */}
        {selectionStats.count > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 mb-6 border-2 border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Récapitulatif de sélection</h2>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-sm text-gray-600 mb-1">Budget disponible</div>
                <input
                  type="number"
                  value={budgetDisponible}
                  onChange={(e) => setBudgetDisponible(parseInt(e.target.value) || 0)}
                  className="w-full text-2xl font-bold text-blue-600 border-b-2 border-blue-300 focus:outline-none focus:border-blue-500 px-2 py-1"
                />
                <div className="text-xs text-gray-500 mt-1">€</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-sm text-gray-600 mb-1">Projets sélectionnés</div>
                <div className="text-3xl font-bold text-green-600">{selectionStats.count}</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-sm text-gray-600 mb-1">Budget consommé</div>
                <div className="text-3xl font-bold text-orange-600">{formatCurrency(selectionStats.totalBudget)}</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-sm text-gray-600 mb-1">Budget restant</div>
                <div className={`text-3xl font-bold ${selectionStats.budgetRestant < 0 ? 'text-red-600' : selectionStats.pourcentageUtilise > 80 ? 'text-orange-600' : 'text-green-600'}`}>
                  {formatCurrency(selectionStats.budgetRestant)}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span>Utilisation du budget</span>
                <span className={selectionStats.pourcentageUtilise > 100 ? 'text-red-600' : selectionStats.pourcentageUtilise > 80 ? 'text-orange-600' : 'text-green-600'}>
                  {selectionStats.pourcentageUtilise.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${selectionStats.pourcentageUtilise > 100 ? 'bg-red-500' : selectionStats.pourcentageUtilise > 80 ? 'bg-orange-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(selectionStats.pourcentageUtilise, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Délai total estimé :</span> {selectionStats.totalDelai} semaines
              </div>
              <button
                onClick={exportSelection}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter la sélection
              </button>
            </div>

            {selectionStats.budgetRestant < 0 && (
              <div className="mt-4 bg-red-100 border-2 border-red-400 rounded-lg p-4 text-red-800">
                <span className="font-bold">⚠️ Attention :</span> Le budget de vos projets sélectionnés dépasse le budget disponible de <span className="font-bold">{formatCurrency(Math.abs(selectionStats.budgetRestant))}</span>
              </div>
            )}
          </div>
        )}

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Settings2 className="w-5 h-5 mr-2" />
            Panneau de contrôle
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Pondérations des critères</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700 w-40">Impact Business</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weights.impactBusiness}
                    onChange={(e) => updateWeight('impactBusiness', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-blue-600 font-semibold w-12 text-right">{weights.impactBusiness}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700 w-40">Complexité</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weights.complexite}
                    onChange={(e) => updateWeight('complexite', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-orange-600 font-semibold w-12 text-right">{weights.complexite}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700 w-40">Budget</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weights.budgetScore}
                    onChange={(e) => updateWeight('budgetScore', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-green-600 font-semibold w-12 text-right">{weights.budgetScore}</span>
                </div>
              </div>
              <div className="mt-3 text-sm font-semibold text-blue-600">
                Total pondération : {totalWeight}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Filtres et actions</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Nom du projet ou description..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={exportCSV}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter CSV complet
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead
                className="text-white"
                style={{ background: `linear-gradient(to right, ${client.couleurPrimaire}, ${client.couleurSecondaire})` }}
              >
                <tr>
                  <th className="px-3 py-3 text-center text-xs font-semibold uppercase">✓</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase">Rang</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase">Projet</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold uppercase">Impact</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold uppercase">Complexité</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase">Score</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase">Priorité</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase">Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedProjects.map((project, idx) => {
                  const priority = getPriority(project.score)
                  const isSelected = selectedProjects.includes(project.id)
                  const scores = project.scores as ProjectScores

                  return (
                    <tr key={project.id} className={`hover:bg-blue-50 ${isSelected ? 'bg-green-50' : ''}`}>
                      <td className="px-3 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProjectSelection(project.id)}
                          className="w-5 h-5 text-green-600 cursor-pointer rounded border-gray-300 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-3 py-4 text-center font-bold text-gray-700">#{idx + 1}</td>
                      <td className="px-3 py-4">
                        <div className="font-semibold text-gray-900">{project.titre}</div>
                        <div className="text-xs text-gray-600 mt-1">{project.description}</div>
                        <div className="text-xs text-blue-600 mt-1">
                          {project.delaiSemaines} semaines • {project.kpi}
                        </div>
                        {project.additionalInfo && (
                          <div className="text-xs text-gray-500 mt-1 italic">
                            ℹ️ {project.additionalInfo}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-4">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={scores.impactBusiness || 5}
                          onChange={(e) => updateProjectCriteria(project.id, 'impactBusiness', parseInt(e.target.value))}
                          className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-semibold text-blue-600"
                        />
                      </td>
                      <td className="px-3 py-4">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={scores.complexite || 5}
                          onChange={(e) => updateProjectCriteria(project.id, 'complexite', parseInt(e.target.value))}
                          className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 font-semibold text-orange-600"
                        />
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-2xl font-bold text-blue-600">{project.score.toFixed(1)}</div>
                      </td>
                      <td className="px-3 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${priority.color}`}>
                          {priority.label}
                        </span>
                      </td>
                      <td className="px-3 py-4 font-semibold text-gray-900">{formatCurrency(project.budget)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h3 className="font-bold text-gray-900 mb-3">📊 Méthodologie</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold mb-1">Impact Business (0-10)</p>
              <p className="text-xs">Potentiel CA, croissance, acquisition clients</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Complexité (0-10)</p>
              <p className="text-xs">Niveau de complexité technique et organisationnelle. 0 = simple, 10 = très complexe</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Budget (automatique)</p>
              <p className="text-xs">Score calculé : budget faible = meilleur score. ≤2000€ = 10/10, ≥30000€ = 1/10</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-amber-700 font-semibold mb-2">⚠️ À propos des budgets</p>
            <p className="text-xs text-gray-700">
              Les budgets indiqués sont arrondis et estimatifs. Un chiffrage à la hausse ou à la baisse sera réalisé en fonction du contexte précis et du périmètre du projet.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
