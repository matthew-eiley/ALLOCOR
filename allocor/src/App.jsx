import { useState } from 'react'
import './App.css'
import Team from './components/Team'
import Home from './components/Home'
import Register from './components/registration'
import SignOutButton from './components/auth/SignOutButton'

function App() {
  const [isRegistered, setIsRegistered] = useState(false)

  return (
    <>
      <SignOutButton onSignOut={() => setIsRegistered(false)} />
    </>
  )
}

export default App
