"use client"

import { AuthProvider } from '@/lib/auth-context'
import { InventoryProvider } from '@/lib/inventory-context'
import { InventoryApp } from '@/components/inventory-app'

export default function HomePage() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <main className="min-h-screen bg-background">
          <InventoryApp />
        </main>
      </InventoryProvider>
    </AuthProvider>
  )
}
