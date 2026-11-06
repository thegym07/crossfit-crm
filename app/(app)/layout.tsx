import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import VisiteGuidee from '@/components/VisiteGuidee'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Navbar />
      <main className="flex-1 md:ml-0 pb-20 md:pb-0 bg-[#F4F4F4]">
        {children}
      </main>
      <Suspense fallback={null}>
        <VisiteGuidee />
      </Suspense>
    </div>
  )
}
