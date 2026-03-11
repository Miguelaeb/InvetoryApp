"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { type Article, type Movement, type MovementType } from './types'

interface InventoryContextType {
  articles: Article[]
  movements: Movement[]
  addArticle: (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'stock'>) => void
  updateArticle: (id: string, article: Partial<Article>) => void
  deleteArticle: (id: string) => boolean
  addMovement: (articleId: string, type: MovementType, quantity: number, concept: string) => { success: boolean; message: string }
  getArticleById: (id: string) => Article | undefined
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([])
  const [movements, setMovements] = useState<Movement[]>([])

  useEffect(() => {
    const storedArticles = localStorage.getItem('inventory_articles')
    const storedMovements = localStorage.getItem('inventory_movements')
    
    if (storedArticles) {
      setArticles(JSON.parse(storedArticles))
    }
    if (storedMovements) {
      setMovements(JSON.parse(storedMovements))
    }
  }, [])

  const saveArticles = (newArticles: Article[]) => {
    setArticles(newArticles)
    localStorage.setItem('inventory_articles', JSON.stringify(newArticles))
  }

  const saveMovements = (newMovements: Movement[]) => {
    setMovements(newMovements)
    localStorage.setItem('inventory_movements', JSON.stringify(newMovements))
  }

  const addArticle = (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'stock'>) => {
    const newArticle: Article = {
      ...article,
      id: crypto.randomUUID(),
      stock: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    saveArticles([...articles, newArticle])
  }

  const updateArticle = (id: string, updates: Partial<Article>) => {
    const updatedArticles = articles.map((article) =>
      article.id === id
        ? { ...article, ...updates, updatedAt: new Date().toISOString() }
        : article
    )
    saveArticles(updatedArticles)
  }

  const deleteArticle = (id: string): boolean => {
    const article = articles.find((a) => a.id === id)
    if (article && article.stock > 0) {
      return false
    }
    saveArticles(articles.filter((a) => a.id !== id))
    return true
  }

  const addMovement = (
    articleId: string,
    type: MovementType,
    quantity: number,
    concept: string
  ): { success: boolean; message: string } => {
    const article = articles.find((a) => a.id === articleId)
    
    if (!article) {
      return { success: false, message: 'Artículo no encontrado.' }
    }

    if (type === 'salida' && article.stock < quantity) {
      return { success: false, message: 'No hay suficiente existencia disponible.' }
    }

    const newStock = type === 'entrada' ? article.stock + quantity : article.stock - quantity

    const newMovement: Movement = {
      id: crypto.randomUUID(),
      articleId,
      articleName: article.name,
      articleCode: article.code,
      type,
      quantity,
      concept,
      createdAt: new Date().toISOString(),
    }

    updateArticle(articleId, { stock: newStock })
    saveMovements([newMovement, ...movements])

    return { success: true, message: 'Movimiento registrado correctamente.' }
  }

  const getArticleById = (id: string) => articles.find((a) => a.id === id)

  return (
    <InventoryContext.Provider
      value={{
        articles,
        movements,
        addArticle,
        updateArticle,
        deleteArticle,
        addMovement,
        getArticleById,
      }}
    >
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider')
  }
  return context
}
