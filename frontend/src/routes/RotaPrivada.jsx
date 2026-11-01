import { Navigate } from 'react-router-dom'

const RotaPrivada = ({ usuario, children }) => {
  if (!usuario) return <Navigate to="/login" replace />

  return children
}

export default RotaPrivada
