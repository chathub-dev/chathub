const key = 'language' // from i18next-browser-languagedetector

export function setLanguage(lang: string | undefined) {
  if (!lang) {
    localStorage.removeItem(key)
  } else {
    localStorage.setItem(key, lang)
  }
}

export function getLanguage() {
  return localStorage.getItem(key) || undefined
}
