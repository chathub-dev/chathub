import { RouterProvider } from '@tanstack/react-router'
import { createRoot } from 'react-dom/client'
import { DarkMode, getUserConfig } from '~services/user-config'
import './base.scss'
import './i18n'
import { plausible } from './plausible'
import { router } from './router'

const container = document.getElementById('app')!
const root = createRoot(container)

getUserConfig().then(({ darkMode }) => {
  if (
    darkMode === DarkMode.Dark ||
    (darkMode === DarkMode.Auto && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('light')
  } else {
    document.documentElement.classList.add('light')
    document.documentElement.classList.remove('dark')
  }
})


  
root.render(<RouterProvider router={router} />)

plausible.enableAutoPageviews()
