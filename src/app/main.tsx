import { RouterProvider } from '@tanstack/react-router'
import Plausible from 'plausible-tracker'
import { createRoot } from 'react-dom/client'
import './base.scss'
import { router } from './router'

const container = document.getElementById('app')!
const root = createRoot(container)
root.render(<RouterProvider router={router} />)

const plausible = Plausible({ domain: 'chathub.gg', hashMode: true })
plausible.enableAutoPageviews()
