import { BOARD_SIZE } from "@/constants"
import type { BoardMatrix } from "@/types"

export const createEmptyBoard = (): BoardMatrix =>
  Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => 0),
  )