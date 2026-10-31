import { Navigate } from 'react-router-dom'

const RotaPublica = ({ usuario, children }) => {
  if (usuario) return <Navigate to="/" replace />

  return children
}

export default RotaPublica
