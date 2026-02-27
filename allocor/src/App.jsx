import { useState } from 'react'
import './App.css'
import Team from './components/Team'
import Home from './components/Home'
import Register from './components/registration'

function App() {
  const [isRegistered, setIsRegistered] = useState(false)

  return (
    <>
      {isRegistered ? <Home /> : <Register onRegisterSuccess={() => setIsRegistered(true)} />}
    </>
  );
}

export default App;
