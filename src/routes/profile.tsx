import { useContext } from 'react'
import { AuthContext } from '../context/auth-context'

function Profile() {
  const { currentUser, signOut } = useContext(AuthContext)
  
  return(
    <div>
      <h3>Welcome! {currentUser?.email}</h3>
      <p>Sign In Status: {currentUser && 'active'}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
export default Profile
