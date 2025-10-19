import { ChevronDown } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Homepage,
})

function Homepage() {
  const navigate = useNavigate();
  const [isJoinOpen, setIsJoinOpen] = useState(false)
  const [roomCodeInput, setRoomCodeInput] = useState('')
  // const [generatedRoomCode, setGeneratedRoomCode] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const handleQuickPlay = () => {
    setStatusMessage('Quick Play matchmaking is coming soon.')
    // const newRoomCode =
    //   typeof globalThis.crypto?.randomUUID === 'function'
    //     ? globalThis.crypto.randomUUID().slice(0, 8).toUpperCase()
    //     : Math.random().toString(36).slice(2, 10).toUpperCase()
    // // setGeneratedRoomCode(newRoomCode)
    // // setIsJoinOpen(true)
    // if (newRoomCode) {
    //   navigate({to: `/room/${newRoomCode}`})
    // }
  }

  const handleJoinSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedCode = roomCodeInput.trim()

    if (!trimmedCode) {
      setStatusMessage('Enter a room ID before joining.')
      return
    }

    setStatusMessage(`Attempting to join room ${trimmedCode}...`)
    navigate({to: `/room/${trimmedCode}`})
  }

  const handleCreateRoom = async () => {
    const newRoomCode =
      typeof globalThis.crypto?.randomUUID === 'function'
        ? globalThis.crypto.randomUUID().slice(0, 8).toUpperCase()
        : Math.random().toString(36).slice(2, 10).toUpperCase()
    // setGeneratedRoomCode(newRoomCode)
    // setIsJoinOpen(true)
    if (newRoomCode) {
      navigate({to: `/room/${newRoomCode}`})
    }
  }

  const toggleJoin = () => {
    setIsJoinOpen((prev) => !prev)
    setStatusMessage(null)
  }

  return (
    <div className="w-full max-w-xl min-h-screen h-full border border-white/40 bg-white/70 p-10 shadow-2xl backdrop-blur">
      <header className="mb-8 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Multiplayer
        </p>
        <h1 className="text-4xl font-extrabold text-slate-900">
          Tic Tac Toe Arena
        </h1>
        <p className="text-base text-slate-600">
          Start a quick match or share a private room ID to challenge a friend.
        </p>
      </header>

      <div className="flex flex-col gap-4 md:flex-row">
        <button
          onClick={handleQuickPlay}
          className="flex-1 rounded-xl bg-indigo-600 px-5 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
        >
          Quick Play
        </button>

        <div className="relative flex-1">
          <button
            onClick={toggleJoin}
            className="flex w-full items-center justify-between rounded-xl border border-indigo-100 bg-white px-5 py-4 text-base font-semibold text-slate-800 shadow-lg transition hover:border-indigo-200 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
            aria-expanded={isJoinOpen}
          >
            Join a Room
            <ChevronDown
              aria-hidden="true"
              strokeWidth={2.5}
              className={`ml-4 h-4 w-4 transition-transform ${
                isJoinOpen ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </button>

          {isJoinOpen && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-10 rounded-2xl border border-indigo-100 bg-white p-6 shadow-2xl">
              <form className="space-y-4" onSubmit={handleJoinSubmit}>
                <div className="space-y-2">
                  <label
                    htmlFor="room-code"
                    className="text-sm font-semibold text-slate-600"
                  >
                    Enter an invite ID
                  </label>
                  <input
                    id="room-code"
                    type="text"
                    value={roomCodeInput}
                    onChange={(event) => setRoomCodeInput(event.target.value)}
                    placeholder="e.g. AB12CD34"
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-400"
                >
                  Join Room
                </button>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                  or create one
                </p>
                <button
                  onClick={handleCreateRoom}
                  className="w-full rounded-lg border border-dashed border-indigo-300 px-4 py-3 text-base font-semibold text-indigo-600 transition hover:border-indigo-400 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
                >
                  Create Room
                </button>
                {/* {generatedRoomCode && (
                  <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-center font-mono text-lg font-semibold text-slate-800">
                    {generatedRoomCode}
                  </div>
                )} */}
              </div>
            </div>
          )}
        </div>
      </div>

      {statusMessage && (
        <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50 px-5 py-4 text-sm font-medium text-indigo-700">
          {statusMessage}
        </div>
      )}
    </div>
  )
}
