type StatCardProps = {
  label: string
  value: string | number
  sub?: string
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'default'
}

const colorMap = {
  blue:    'border-blue-200 bg-blue-50',
  green:   'border-green-200 bg-green-50',
  red:     'border-red-200 bg-red-50',
  yellow:  'border-[#d9cb4a] bg-[#f8ef9c]/30',
  default: 'border-gray-200 bg-white',
}

const valueColorMap = {
  blue:    'text-blue-600',
  green:   'text-green-600',
  red:     'text-red-600',
  yellow:  'text-[#7d7212]',
  default: 'text-gray-900',
}

export default function StatCard({ label, value, sub, color = 'default' }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <p className="label-condensed mb-1">{label}</p>
      <p className={`font-display text-4xl ${valueColorMap[color]}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}
