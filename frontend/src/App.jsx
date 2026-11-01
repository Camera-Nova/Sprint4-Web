import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Home from './pages/Home'
import RotaPrivada from './routes/RotaPrivada'
import RotaPublica from './routes/RotaPublica'
import useSessao from './hooks/useSessao'

const App = () => {
  const { usuario, entrar, cadastrar, sair } = useSessao()

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <RotaPublica usuario={usuario}>
              <Login onEntrar={entrar} />
            </RotaPublica>
          }
        />

        <Route
          path="/cadastro"
          element={
            <RotaPublica usuario={usuario}>
              <Cadastro onCadastrar={cadastrar} />
            </RotaPublica>
          }
        />

        <Route
          path="/"
          element={
            <RotaPrivada usuario={usuario}>
              <Home usuario={usuario} onSair={sair} />
            </RotaPrivada>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
