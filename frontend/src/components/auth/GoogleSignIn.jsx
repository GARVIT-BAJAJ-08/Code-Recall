import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/context/AuthContext'

const SCRIPT_ID = 'google-identity-services'

function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve()
  const existing = document.getElementById(SCRIPT_ID)
  if (existing) return new Promise((resolve, reject) => { existing.addEventListener('load', resolve, { once: true }); existing.addEventListener('error', reject, { once: true }) })
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export default function GoogleSignIn({ onSuccess, onError }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const button = useRef(null)
  const handlers = useRef({ onSuccess, onError })
  const { googleLogin } = useAuth()
  const [message, setMessage] = useState('')

  useEffect(() => {
    handlers.current = { onSuccess, onError }
  }, [onSuccess, onError])

  useEffect(() => {
    if (!clientId) { setMessage('Google sign-in is not configured yet.'); return undefined }
    let active = true
    loadGoogleScript().then(() => {
      if (!active || !button.current) return
      button.current.replaceChildren()
      window.google.accounts.id.initialize({ client_id: clientId, callback: async ({ credential }) => {
        try { await googleLogin(credential); handlers.current.onSuccess?.() }
        catch (error) { const text = error.message || 'Google sign-in failed. Please try again.'; setMessage(text); handlers.current.onError?.(text) }
      } })
      window.google.accounts.id.renderButton(button.current, { theme: 'outline', size: 'large', text: 'continue_with', shape: 'rectangular', width: 320 })
    }).catch(() => active && setMessage('Google sign-in could not load. Check your connection and try again.'))
    return () => { active = false }
  }, [clientId, googleLogin])

  return <div className="space-y-2"><div ref={button} className="flex justify-center" />{message && <p className="text-center text-xs text-muted">{message}</p>}</div>
}
