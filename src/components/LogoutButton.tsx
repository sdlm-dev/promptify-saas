'use client'

import { signOut } from '@/app/actions/auth'

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="text-xs text-slate-400 hover:text-red-400 transition-colors"
    >
      Sair
    </button>
  )
}