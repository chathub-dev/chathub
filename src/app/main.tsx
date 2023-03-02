import { RouterProvider } from '@tanstack/react-router'
import Plausible from 'plausible-tracker'
import { createRoot } from 'react-dom/client'
import 'react-tooltip/dist/react-tooltip.css'
import '../base.scss'
import { router } from './router'

const container = document.getElementById('app')!
const root = createRoot(container)
root.render(<RouterProvider router={router} />)

const plausible = Plausible({ domain: 'chathub.gg', hashMode: true })
plausible.enableAutoPageviews()
