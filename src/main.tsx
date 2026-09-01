import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import App from './App.tsx'

import Dashboards from './Pages/Dashboards.tsx'
import MapPage from './Pages/MapPage.tsx'
import Cronogramas from './Pages/Cronograma.tsx'
import Equipes from './Pages/Equipes.tsx'
import Relatorios from './Pages/Relatorios.tsx'
import Configuracoes from './Pages/Configuracoes.tsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      {
        index: true,
        element: <Dashboards />
      },

      {
        path: "mapas",
        element: <MapPage />
      },

      {
        path: "cronogramas",
        element: <Cronogramas />
      },

      {
        path: "equipes",
        element: <Equipes />
      },

      {
        path: "relatorios",
        element: <Relatorios />
      },

      {
        path: "config",
        element: <Configuracoes />
      }
    ]
  }
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)