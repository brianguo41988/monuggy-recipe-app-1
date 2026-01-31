'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

type Recipe = {
  id: string
  title: string
  description: string
  ingredients: string
  instructions: string
  image_url: string
  created_at: string
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [instructions, setInstructions] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    fetchRecipes()
  }, [])

  async function fetchRecipes() {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRecipes(data || [])
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setUploading(true)

    try {
      let imageUrl = ''

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('recipe-images')
          .upload(filePath, imageFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('recipe-images')
          .getPublicUrl(filePath)

        imageUrl = publicUrl
      }

      // Insert recipe
      const { error: insertError } = await supabase
        .from('recipes')
        .insert([
          {
            title,
            description,
            ingredients,
            instructions,
            image_url: imageUrl,
          },
        ])

      if (insertError) throw insertError

      // Reset form
      setTitle('')
      setDescription('')
      setIngredients('')
      setInstructions('')
      setImageFile(null)
      setImagePreview('')
      setShowForm(false)
      
      // Refresh recipes
      fetchRecipes()
    } catch (error) {
      console.error('Error creating recipe:', error)
      alert('Error creating recipe. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-5xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Recette
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary"
            >
              {showForm ? 'Cancel' : '+ New Recipe'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Add Recipe Form */}
        {showForm && (
          <div className="mb-16 animate-fade-in">
            <div className="max-w-2xl mx-auto bg-white border border-[var(--border)] rounded-sm p-8">
              <h2 className="text-3xl mb-6" style={{ color: 'var(--text-primary)' }}>
                Add New Recipe
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Recipe Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                    required
                    placeholder="Grandma's Chocolate Chip Cookies"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field"
                    placeholder="A brief description of your recipe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Ingredients (one per line)
                  </label>
                  <textarea
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="input-field"
                    required
                    placeholder="2 cups flour&#10;1 cup sugar&#10;3 eggs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Instructions
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="input-field"
                    required
                    placeholder="Step-by-step cooking instructions"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Recipe Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="input-field"
                  />
                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-sm"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary w-full"
                >
                  {uploading ? 'Saving...' : 'Save Recipe'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Recipes Grid */}
        <div>
          <h2 className="text-3xl mb-8" style={{ color: 'var(--text-primary)' }}>
            My Recipes
          </h2>
          
          {loading ? (
            <div className="text-center py-20" style={{ color: 'var(--text-secondary)' }}>
              Loading recipes...
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl mb-4" style={{ color: 'var(--text-secondary)' }}>
                No recipes yet
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                Click "New Recipe" to add your first one!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe, index) => (
                <div
                  key={recipe.id}
                  className={`recipe-card animate-fade-in stagger-${Math.min(index + 1, 3)}`}
                >
                  {recipe.image_url && (
                    <div className="relative h-56 w-full overflow-hidden">
                      <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>
                      {recipe.title}
                    </h3>
                    {recipe.description && (
                      <p className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {recipe.description}
                      </p>
                    )}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide" style={{ color: 'var(--accent-dark)' }}>
                          Ingredients
                        </h4>
                        <p className="text-sm whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                          {recipe.ingredients}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide" style={{ color: 'var(--accent-dark)' }}>
                          Instructions
                        </h4>
                        <p className="text-sm whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                          {recipe.instructions}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
