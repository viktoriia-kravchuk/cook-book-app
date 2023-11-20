import { useContext, useEffect } from 'react'
import { Routes , Route, useNavigate } from 'react-router-dom'
import { AuthContext } from './context/auth-context'
import StartPage from './routes/StartPage'
import Explore from './routes/Explore'
import AddRecipeForm from './routes/AddRecipeForm/AddRecipeForm'

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
      <Route index element={<StartPage />} />
      <Route path="explore" element={currentUser ? <Explore />: <StartPage />} />     
      <Route path="/start"  element={ currentUser ? <Explore/> : <StartPage />} />
      <Route path="/saved"  element={ currentUser ? <Explore/> : <StartPage />} />
      <Route path="/planner"  element={ currentUser ? <Explore/> : <StartPage />} />
      <Route path="/lists"  element={ currentUser ? <Explore/> : <StartPage />} />
      <Route path="/add-recipe" element={currentUser ? <AddRecipeForm/> : <StartPage/> }/>

    </Routes>
  )
}

export default App
