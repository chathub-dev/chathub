function isArcBrowser() {
  return getComputedStyle(document.documentElement).getPropertyValue('--arc-palette-background')
}

export { isArcBrowser }
