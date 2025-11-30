import type { Language } from '../translations'

const COOKIE_NAME = 'preferredLanguage'
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365 // 1 year

const setCookie = (name: string, value: string) => {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}`
}

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  const cookies = document.cookie ? document.cookie.split('; ') : []
  for (const cookie of cookies) {
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1)
    }
  }
  return null
}

export const savePreferredLanguage = (lang: Language) => {
  try {
    localStorage.setItem(COOKIE_NAME, lang)
  } catch (e) {
    // ignore storage issues
  }
  setCookie(COOKIE_NAME, lang)
}

export const loadPreferredLanguage = (): Language | null => {
  const cookieValue = getCookie(COOKIE_NAME)
  if (cookieValue === 'en' || cookieValue === 'ru') {
    return cookieValue
  }

  try {
    const stored = localStorage.getItem(COOKIE_NAME) as Language | null
    if (stored === 'en' || stored === 'ru') {
      return stored
    }
  } catch (e) {
    // ignore storage issues
  }

  return null
}
