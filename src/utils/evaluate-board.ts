import type { BoardMatrix, GameResult } from "@/types"
import { BOARD_SIZE } from "@/constants"

export default function evaluateBoard(board: BoardMatrix): GameResult | null {
  // Horizontal and vertical checks
  for (let index = 0; index < BOARD_SIZE; index++) {
    const rowSlice = board[index]
    if (rowSlice.every((cell) => cell > 0 && (cell - rowSlice[0]) % 2 === 0 )) {
      return {
        winner: rowSlice[0] % 2 === 0 ? "Even": "Odd",
        winningLine: rowSlice.map((_, col) => [index, col]),
      }
    }

    const firstInColumn = board[0][index]
    if (
      firstInColumn > 0 &&
      board.every((row) => row[index] > 0 && ( row[index] - firstInColumn ) % 2 === 0)
    ) {
      return {
        winner: firstInColumn % 2 === 0 ? "Even": "Odd",
        winningLine: board.map((_, row) => [row, index]),
      }
    }
  }

  // Main diagonal top-left -> bottom-right
  const diagonalMain = board.map((row, index) => row[index])
  if (
    diagonalMain[0] > 0 &&
    diagonalMain.every((cell) => cell > 0 && (cell - diagonalMain[0]) % 2 === 0)
  ) {
    return {
      winner: diagonalMain[0] % 2 === 0 ? "Even": "Odd",
      winningLine: diagonalMain.map((_, index) => [index, index]),
    }
  }

  // Anti-diagonal top-right -> bottom-left
  const diagonalAnti = board.map((row, index) => row[BOARD_SIZE - 1 - index])
  if (
    diagonalAnti[0] > 0 &&
    diagonalAnti.every((cell) => cell > 0 && (cell - diagonalAnti[0]) % 2 === 0 )
  ) {
    return {
      winner: diagonalAnti[0] % 2 === 0 ? "Even": "Odd",
      winningLine: diagonalAnti.map((_, index) => [
        index,
        BOARD_SIZE - 1 - index,
      ]),
    }
  }

  const isDraw = board.every((row) => row.every((cell) => cell !== 0))

  if (isDraw) {
    return {
      winner: null,
      winningLine: [],
    }
  }

  return null
}