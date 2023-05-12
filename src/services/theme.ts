export enum ThemeMode {
  Auto = 'auto',
  Light = 'light',
  Dark = 'dark',
}

function getUserThemeMode(): ThemeMode {
  return (localStorage.getItem('themeMode') as ThemeMode) || ThemeMode.Auto
}

function setUserThemeMode(themeMode: ThemeMode) {
  localStorage.setItem('themeMode', themeMode)
}

export { getUserThemeMode, setUserThemeMode }
