import { io } from 'socket.io-client'
import { useState, useEffect } from 'react'
import Board from '@/components/Board'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import type { Socket } from 'socket.io-client'
import type { BoardMatrix, Player, GameResult } from '@/types'
import { PLAYERS } from '@/constants'
import { createEmptyBoard } from '@/utils/empty-board'

export const Route = createFileRoute('/room/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  const [gameStart, setGameStart] = useState<boolean>(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player| null>(null);
  const [board, setBoard] = useState<BoardMatrix>(() => createEmptyBoard());
  const [result, setResult] = useState<GameResult | null>(null);
  const [generatedRoomCode, setGeneratedRoomCode] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { id: roomId } = Route.useParams();

  async function handleCopyCode() {
    try {
      if (generatedRoomCode && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(generatedRoomCode)
      } else {
        throw new Error('Clipboard API unavailable')
      }
      console.log('Room created! We copied the new ID to your clipboard.')
    } catch {
      console.log('Room created! Share the room ID shown below.')
    }
  }

  useEffect(() => {
    console.log(roomId)
    setGeneratedRoomCode(roomId)
  }, [roomId])

  useEffect(() => {
    // connect once when app mounts
    const socket = io(import.meta.env.VITE_APP_API_URL as string)

    socket.on('connect', () => {
      console.log('✅ Connected to server')
      setSocket(socket)

      if (!roomId) return
      socket.emit(
        'room:join',
        { roomId },
        (ack: { ok: boolean; role?: Player; error?: string }) => {
          if (!ack?.ok) {
            console.warn('Cannot join room:', ack?.error)
            navigate({to: '/'})
            // optional: navigate away or show toast
            return
          }
          console.log(ack)
          // Save role in state/context so Board can use it
          setCurrentPlayer(ack.role!);
        },
      )
    })

    socket.on('start-game', () => {
      console.log("The game begins!");
      setGameStart(true)
    })

    socket.on("single-room", () => {
      console.log("You are the only player left in the room");
      setCurrentPlayer(PLAYERS[0]);
      setGameStart(false)
    })

    socket.on('game:move', (updatedBoard) => {
      setBoard(updatedBoard)
    })

    socket.on('game:result', (result)=> {
      setResult(result)
    })

    socket.on('disconnect', () => {
      socket.emit("room:leave", {roomId})
      console.log('❌ Disconnected from server')
    })

    // cleanup on unmount
    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div className="w-full max-w-xl min-h-screen h-full border border-white/40 bg-white/70 p-10 shadow-2xl backdrop-blur">
      <div className="mb-4 w-full flex flex-row items-center p-4 rounded-3xl bg-white">
        <div className="flex-1  px-4 py-3 text-center font-mono text-lg font-semibold text-slate-800">
          {generatedRoomCode}
        </div>
        <button
          onClick={handleCopyCode}
          className="text-slate-500 font-semibold text-lg px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors duration-100 ease-in"
        >
          Copy <span className="hidden md:inline">code</span>
        </button>
      </div>
      <Board
        socket={socket}
        roomId={roomId}
        board={board}
        setBoard={setBoard}
        currentPlayer={currentPlayer}
        setCurrentPlayer={setCurrentPlayer}
        result={result}
        setResult={setResult}
        gameStart={gameStart}
      />
    </div>
  )
}
