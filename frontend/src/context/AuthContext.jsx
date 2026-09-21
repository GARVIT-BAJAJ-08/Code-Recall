import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { changePassword as changePasswordApi, deleteAccount as deleteAccountApi, fetchCurrentUser, googleLogin as googleLoginApi, login as loginApi, requestSignupOtp as requestSignupOtpApi, verifySignupOtp as verifySignupOtpApi } from '@/api/auth'

const AuthContext = createContext(null)
const STORAGE_KEY = 'coderecall.auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return

        const parsed = JSON.parse(raw)
        if (parsed?.user && typeof parsed.token === 'string' && parsed.token) {
          // The API, rather than stale browser storage, is the source of truth
          // after a refresh. apiClient reads the saved Bearer token itself.
          const verifiedUser = await fetchCurrentUser()
          setUser(verifiedUser)
          setToken(parsed.token)
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: verifiedUser, token: parsed.token }))
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      } finally {
        setInitializing(false)
      }
    }
    restoreSession()
  }, [])

  const persist = (nextUser, nextToken) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, token: nextToken }))
    setUser(nextUser)
    setToken(nextToken)
  }

  const login = useCallback(async (credentials) => {
    const { user: loggedInUser, token: newToken } = await loginApi(credentials)
    persist(loggedInUser, newToken)
    return loggedInUser
  }, [])

  const verifySignupOtp = useCallback(async (data) => {
    const { user: newUser, token: newToken } = await verifySignupOtpApi(data)
    persist(newUser, newToken)
    return newUser
  }, [])

  const googleLogin = useCallback(async (credential) => {
    const { user: signedInUser, token: newToken } = await googleLoginApi(credential)
    persist(signedInUser, newToken)
    return signedInUser
  }, [])

  const changePassword = useCallback((data) => changePasswordApi(data), [])

  const deleteAccount = useCallback(async () => {
    await deleteAccountApi()
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    setToken(null)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    setToken(null)
  }, [])

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    initializing,
    login,
    requestSignupOtp: requestSignupOtpApi,
    verifySignupOtp,
    googleLogin,
    changePassword,
    deleteAccount,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
