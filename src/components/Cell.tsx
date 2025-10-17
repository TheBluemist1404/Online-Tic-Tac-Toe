import { type MouseEventHandler, type ReactNode } from 'react'

/**
 * Props shared with the Board component. Feel free to adjust or extend them
 * when you plug in your custom Cell implementation.
 */
export interface CellProps {
  row: number
  col: number
  value: ReactNode
  disabled: boolean
  isHighlighted: boolean
  onSelect: MouseEventHandler<HTMLButtonElement>
}

/**
 * Placeholder Cell component. Replace the markup, styling, or behaviour with
 * your custom gameplay variation when you're ready.
 */
export default function Cell({
  value,
  disabled,
  isHighlighted,
  onSelect,
}: CellProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`flex size-10 md:size-16 items-center justify-center rounded-xl border text-2xl font-bold transition ${
        isHighlighted
          ? 'border-indigo-500 bg-indigo-100 text-indigo-700'
          : `border-slate-200 bg-neutral-100 ${value !== null && "bg-neutral-300"} text-slate-700 hover:border-indigo-400 hover:bg-indigo-50`
      }  
      ${disabled ? 'cursor-not-allowed opacity-60 bg-red' : 'cursor-pointer'}`}
    >
      {value}
    </button>
  )
}
