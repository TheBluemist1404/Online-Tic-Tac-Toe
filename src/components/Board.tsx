import { useCallback, useEffect, useMemo, useState } from 'react'
import { evaluateBoard } from '@/utils/evaluate-board'
import type { Player, BoardMatrix, GameResult } from '@/types'
import { BOARD_SIZE } from '@/constants'
import { createEmptyBoard } from '@/utils/empty-board'
import type { Socket } from 'socket.io-client'

import Cell from './Cell'

type BoardProps = {
  socket: Socket | null
  roomId: string
  board: BoardMatrix
  setBoard: React.Dispatch<React.SetStateAction<BoardMatrix>>
  currentPlayer: Player | null
  setCurrentPlayer: React.Dispatch<React.SetStateAction<Player | null>>
  result: GameResult | null
  setResult: React.Dispatch<React.SetStateAction<GameResult | null>>
  gameStart: boolean
}

export default function Board({ socket, roomId, board, setBoard, currentPlayer, result, setResult, gameStart }: BoardProps) {
  const [statusLabel, setStatusLabel] = useState<string>("Waiting for opponent...")

  useEffect(() => {
    if (socket) {
      console.log(`Socket ${socket?.id}`);
    }
  }, [socket])

  useEffect(()=> {
    if (gameStart) {
      setStatusLabel("The game begins!");
    } else {
      setStatusLabel("Waiting for opponent...");
    }
  }, [gameStart])

  const winningCells = useMemo(() => {
    if (!result?.winningLine?.length) {
      return new Set<string>()
    }
    return new Set(result.winningLine.map(([row, col]) => `${row}-${col}`))
  }, [result])

  const handleCellSelect = useCallback(
    (row: number, col: number) => {
      if (!socket || result || !gameStart) {
        return
      }

      const newBoard = [...board]
      newBoard[row][col]++
      setBoard(newBoard)

      socket.emit('game:move', { newBoard, roomId })

      const evaluation: GameResult | null = evaluateBoard(newBoard)

      if (evaluation) {
        console.log(evaluation)
        socket.emit("game:result", { result: evaluation, roomId })
        // setResult(evaluation)        
      }
    },
    [socket, board, currentPlayer, result, gameStart],
  )

  useEffect(()=> {
    if (result) {
      console.log("Game result: ", result)
      if (result.winner) {
          setStatusLabel(`Player ${result.winner} has won`)
        } else {
          setStatusLabel("It's a draw")
        }
    }
  }, [result])

  const handleReplay = () => {
    setBoard(createEmptyBoard())
    setResult(null)
  }

  return (
    <section className="flex flex-col items-center gap-6 rounded-3xl border border-white/20 bg-white/80 p-6 md:p-8 shadow-2xl backdrop-blur">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          Live Match
        </p>
        <h2 className="text-3xl font-extrabold text-slate-900">Board</h2>
      </header>

      <p>You are {currentPlayer} player</p>

      <div
        className={`grid gap-2 md:gap-3`}
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
        }}
      >
        {board.map((rowSlice, row) =>
          rowSlice.map((value, col) => {
            const key = `${row}-${col}`
            return (
              <Cell
                key={key}
                row={row}
                col={col}
                value={value}
                isHighlighted={winningCells.has(key)}
                onSelect={() => handleCellSelect(row, col)}
              />
            )
          }),
        )}
      </div>

      <div className="flex w-full flex-col items-center gap-4 text-center">
        <p className="text-base font-semibold text-slate-700">{statusLabel}</p>
        {result && (
          <button
            type="button"
            onClick={handleReplay}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
          >
            Play Again
          </button>
        )}
      </div>
    </section>
  )
}
