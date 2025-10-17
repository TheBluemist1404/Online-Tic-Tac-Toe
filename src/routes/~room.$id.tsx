import Board from '@/components/Board'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/room/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="w-full max-w-xl min-h-screen h-full border border-white/40 bg-white/70 p-10 shadow-2xl backdrop-blur">
    < Board />
  </div>
}
