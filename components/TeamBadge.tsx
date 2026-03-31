'use client'

interface TeamBadgeProps {
  name: string
  color: string
  size?: 'sm' | 'md'
}

export default function TeamBadge({ name, color, size = 'sm' }: TeamBadgeProps) {
  const px = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  return (
    <span
      className={`inline-block rounded-full font-semibold ${px}`}
      style={{
        background: `${color}22`,
        color,
        border: `1px solid ${color}55`,
      }}
    >
      {name}
    </span>
  )
}
