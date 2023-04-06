if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.add('light')
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
  const colorScheme = e.matches ? 'dark' : 'light'
  if (colorScheme === 'dark') {
    document.documentElement.classList.remove('light')
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  }
})

export {}
