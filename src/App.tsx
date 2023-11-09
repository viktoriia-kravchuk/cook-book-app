import { useContext, useEffect } from 'react'
import { Routes , Route, useNavigate } from 'react-router-dom'
import { AuthContext } from './context/auth-context'
import Home from './routes/home'
import Profile from './routes/profile'

function App() {
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()

  console.log('User:', !!currentUser);

  useEffect(() => {
    if (currentUser) {
      navigate('/profile')
    }
  }, [currentUser])
  
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="profile" element={currentUser ? <Profile />: <Home />} />
    </Routes>
  )
}

export default App
