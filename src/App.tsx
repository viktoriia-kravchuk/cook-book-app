import { useContext, useEffect } from 'react'
import { Routes , Route, useNavigate } from 'react-router-dom'
import { AuthContext } from './context/auth-context'
import StartPage from './routes/StartPage'
import Explore from './routes/Explore'
import AddRecipeForm from './routes/AddRecipeForm/AddRecipeForm'
import UserLists from './routes/UserLists'
import RecipePage from './routes/Recipes/RecipePage'
import ListPage from './routes/ListPage'

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
      <Route path="/saved"  element={ currentUser ? <ListPage interaction="save" pageTitle="Saved recipes"/> : <StartPage />} />
      <Route path="/liked"  element={ currentUser ? <ListPage interaction="like" pageTitle="Liked recipes"/> : <StartPage />} />
      <Route path="/planner"  element={ currentUser ? <Explore/> : <StartPage />} />
      <Route path="/lists"  element={ currentUser ? <UserLists/> : <StartPage />} />
      <Route path="/add-recipe" element={currentUser ? <AddRecipeForm/> : <StartPage/> }/>
      <Route path="/recipes/:id" element={<RecipePage/>} />

    </Routes>
  )
}

export default App
