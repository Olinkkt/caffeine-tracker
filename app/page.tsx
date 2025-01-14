import { Dashboard } from '@/components/Dashboard'
import { CaffeineForm } from '@/components/CaffeineForm'
import { Zap } from 'lucide-react'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen py-4">
      <div className="w-full flex justify-center items-center mb-8 mt-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
          <Zap className="mr-2 h-8 w-8 text-yellow-500" />
          Caffeine Beast
        </h1>
      </div>
      <Dashboard />
      <CaffeineForm />
    </main>
  )
}

