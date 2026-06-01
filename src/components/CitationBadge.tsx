'use client'

import { useState, useRef, useEffect } from 'react'
import type { Citation } from '@/types'

interface CitationBadgeProps {
  citation: Citation
  index: number
}

export function CitationBadge({ citation, index }: CitationBadgeProps) {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!show) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [show])

  return (
    <span ref={ref} className="relative inline">
      <button
        onClick={() => setShow(!show)}
        className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
      >
        {index + 1}
      </button>
      {show && (
        <div className="absolute bottom-full left-0 mb-2 w-72 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-50 text-sm">
          <p className="font-medium text-gray-900 mb-1">{citation.title}</p>
          <p className="text-gray-600 text-xs mb-2 line-clamp-2">{citation.snippet}</p>
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-xs underline"
          >
            View source ↗
          </a>
        </div>
      )}
    </span>
  )
}
