import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Historico from "./pages/Historico"


const App = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>}/>
            <Route path="/historico" element={<Historico/>}/>
        </Routes>
    </Router>
  )
}

export default App
