import { useState } from 'react'
import './App.css'
import Team from './components/Team'
import Home from './components/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Home/>
    </>
  )
}

export default App
