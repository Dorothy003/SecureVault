import { useState } from 'react'
import Hero from './Components/hero'
import Navbar from './Components/navbar'
import {Toaster} from 'react-hot-toast'
import Signin from './Components/signin'
import Login from './Components/login'
import Dashboard from './Components/dashboard'
import {BrowserRouter as Router,Route,Routes} from "react-router-dom"
function App() {
  //const [count, setCount] = useState(0)

  return (
    <Router>
           <Routes>
            <Route path='/' element={
               <>
               <Navbar/>
               <Hero/>
               </>
            }/>
            
            <Route path='/signin' element={<Signin/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>D
           </Routes>
    </Router>

  )
}

export default App
