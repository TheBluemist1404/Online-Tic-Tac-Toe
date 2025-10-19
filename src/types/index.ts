type Player = 'Odd' | 'Even'
type BoardMatrix = number[][]
interface GameResult {
  winner: Player | null
  winningLine: Array<[number, number]>
}

export type {Player, BoardMatrix, GameResult};