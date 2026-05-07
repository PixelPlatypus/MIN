'use client'

export default function NepalBar({ position = 'left' }) {
  return (
    <div
      className={`absolute top-0 bottom-0 w-1 bg-[#D4253E] opacity-80 ${
        position === 'left' ? 'left-0' : 'right-0'
      }`}
      aria-hidden="true"
    />
  )
}
