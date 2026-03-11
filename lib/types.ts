export interface User {
  id: string
  username: string
  password: string
}

export interface Article {
  id: string
  code: string
  name: string
  description: string
  cost: number
  stock: number
  createdAt: string
  updatedAt: string
}

export type MovementType = 'entrada' | 'salida'

export interface Movement {
  id: string
  articleId: string
  articleName: string
  articleCode: string
  type: MovementType
  quantity: number
  concept: string
  createdAt: string
}

// Default users for the academic MVP
export const DEFAULT_USERS: User[] = [
  { id: '1', username: 'admin', password: 'admin123' },
  { id: '2', username: 'usuario', password: 'usuario123' },
]
