import { useState } from 'react'
import './App.css'
import Team from './components/Team'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Team/>
    </>
  )
}

export default App
