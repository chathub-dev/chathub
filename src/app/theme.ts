import { getUserThemeMode } from '~services/theme'
import { applyThemeMode } from './utils/color-scheme'

applyThemeMode(getUserThemeMode())

export {}
