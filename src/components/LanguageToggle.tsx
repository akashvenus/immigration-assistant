'use client'

interface LanguageToggleProps {
  simplified: boolean
  onChange: (v: boolean) => void
}

export function LanguageToggle({ simplified, onChange }: LanguageToggleProps) {
  return (
    <button
      onClick={() => onChange(!simplified)}
      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
        simplified
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
      title="Toggle simplified language"
    >
      {simplified ? '🌱 Simplified' : '📘 Standard'}
    </button>
  )
}
