import { useContext, useEffect } from 'react'
import { Routes , Route, useNavigate } from 'react-router-dom'
import { AuthContext } from './context/auth-context'
import Home from './routes/Home'
import Explore from './routes/Explore'

function App() {
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()

  console.log('User:', !!currentUser);

  useEffect(() => {
    if (currentUser) {
      navigate('/explore')
    }
  }, [currentUser])
  
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="explore" element={currentUser ? <Explore />: <Home />} />     
      <Route path="/home"  element={ currentUser ? <Explore/> : <Home />} />
      <Route path="/saved"  element={ currentUser ? <Explore/> : <Home />} />
      <Route path="/planner"  element={ currentUser ? <Explore/> : <Home />} />
      <Route path="/lists"  element={ currentUser ? <Explore/> : <Home />} />

    </Routes>
  )
}

export default App
