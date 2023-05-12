import { ThemeMode } from '~services/theme'
import tinycolor from 'tinycolor2'

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)'

function light() {
  document.documentElement.classList.remove('dark')
  document.documentElement.classList.add('light')
}

function dark() {
  document.documentElement.classList.remove('light')
  document.documentElement.classList.add('dark')
}

function isSystemDarkMode() {
  return !!window.matchMedia(COLOR_SCHEME_QUERY).matches
}

function colorSchemeListener(e: MediaQueryListEvent) {
  const colorScheme = e.matches ? 'dark' : 'light'
  if (colorScheme === 'dark') {
    dark()
  } else {
    light()
  }
}

function applyThemeMode(mode: ThemeMode) {
  if (mode === ThemeMode.Light) {
    light()
    window.matchMedia(COLOR_SCHEME_QUERY).removeEventListener('change', colorSchemeListener)
    return
  }

  if (mode === ThemeMode.Dark) {
    dark()
    window.matchMedia(COLOR_SCHEME_QUERY).removeEventListener('change', colorSchemeListener)
    return
  }

  if (isSystemDarkMode()) {
    dark()
  } else {
    light()
  }

  window.matchMedia(COLOR_SCHEME_QUERY).addEventListener('change', colorSchemeListener)
}

function getDefaultThemeColor() {
  const color = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-purple')
  const [r, g, b] = color.split(' ')
  const c = tinycolor({ r, g, b })
  return c.toHexString()
}

export { applyThemeMode, getDefaultThemeColor }
