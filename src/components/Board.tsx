import { useCallback, useMemo, useState } from 'react'

import Cell from './Cell'

type Player = 'X' | 'O'
type CellValue = Player | null

const BOARD_SIZE = 5
const PLAYERS: readonly Player[] = ['X', 'O']

type BoardMatrix = CellValue[][]

interface GameResult {
  winner: Player | null
  winningLine: Array<[number, number]>
}

const createEmptyBoard = (): BoardMatrix =>
  Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null),
  )

const togglePlayer = (player: Player): Player =>{
  return player === PLAYERS[0] ? PLAYERS[1] : PLAYERS[0]
}
  

const evaluateBoard = (board: BoardMatrix): GameResult | null => {
  // Horizontal and vertical checks
  for (let index = 0; index < BOARD_SIZE; index += 1) {
    const rowSlice = board[index]
    if (rowSlice.every((cell) => cell && cell === rowSlice[0])) {
      return {
        winner: rowSlice[0],
        winningLine: rowSlice.map((_, col) => [index, col]),
      }
    }

    const firstInColumn = board[0][index]
    if (
      firstInColumn &&
      board.every((row) => row[index] && row[index] === firstInColumn)
    ) {
      return {
        winner: firstInColumn,
        winningLine: board.map((_, row) => [row, index]),
      }
    }
  }

  // Main diagonal top-left -> bottom-right
  const diagonalMain = board.map((row, index) => row[index])
  if (
    diagonalMain[0] &&
    diagonalMain.every((cell) => cell && cell === diagonalMain[0])
  ) {
    return {
      winner: diagonalMain[0],
      winningLine: diagonalMain.map((_, index) => [index, index]),
    }
  }

  // Anti-diagonal top-right -> bottom-left
  const diagonalAnti = board.map((row, index) => row[BOARD_SIZE - 1 - index])
  if (
    diagonalAnti[0] &&
    diagonalAnti.every((cell) => cell && cell === diagonalAnti[0])
  ) {
    return {
      winner: diagonalAnti[0],
      winningLine: diagonalAnti.map((_, index) => [
        index,
        BOARD_SIZE - 1 - index,
      ]),
    }
  }

  const isDraw = board.every((row) => row.every((cell) => cell !== null))

  if (isDraw) {
    return {
      winner: null,
      winningLine: [],
    }
  }

  return null
}

export default function Board() {
  const [board, setBoard] = useState<BoardMatrix>(() => createEmptyBoard())
  const [currentPlayer, setCurrentPlayer] = useState<Player>(PLAYERS[0])
  const [result, setResult] = useState<GameResult | null>(null)
  const [statusLabel, setStatusLabel] = useState<string>(`Player ${PLAYERS[0]}'s turn`)

  const winningCells = useMemo(() => {
    if (!result?.winningLine?.length) {
      return new Set<string>()
    }
    return new Set(result.winningLine.map(([row, col]) => `${row}-${col}`))
  }, [result])

  const handleCellSelect = useCallback(
    (row: number, col: number) => {
      if (result || board[row][col] !== null) {
        return
      }

      const newBoard = [...board]
      newBoard[row][col] = currentPlayer;
      setBoard(newBoard);

      const evaluation: GameResult | null = evaluateBoard(newBoard);

      if (evaluation) {
        setResult(evaluation);
        if (evaluation.winner) {
          setStatusLabel(`Player ${currentPlayer} has won`)
        } else {
          setStatusLabel("It's a draw")
        }
      } else {
        setCurrentPlayer((cur) => togglePlayer(cur));
        setStatusLabel(`Player ${togglePlayer(currentPlayer)}'s turn`);
      }     
      
    },
    [board, currentPlayer, result],
  )

  const handleReplay = () => {
    setBoard(createEmptyBoard())
    setCurrentPlayer(PLAYERS[0])
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
                disabled={Boolean(result) || value !== null}
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
