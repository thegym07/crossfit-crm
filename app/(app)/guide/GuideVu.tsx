'use client'

import { useEffect } from 'react'
import { GUIDE_VU } from '@/lib/guide'

// Retient (sur cet appareil) que le guide a été ouvert : les connexions suivantes vont directement au Dashboard.
export default function GuideVu() {
  useEffect(() => {
    try { localStorage.setItem(GUIDE_VU, '1') } catch {}
  }, [])
  return null
}
