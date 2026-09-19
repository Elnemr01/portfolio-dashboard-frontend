import { Route, Routes } from "react-router-dom"
import InverseProtected from "./protectRoutes/InverseProtected"
import Login from "./pages/login/Login"
import Projects from "./pages/projects/Projects"
import AddProject from "./pages/projects/AddProject"
import AppRoutes from "./protectRoutes/AppRoutes"
import Home from "./pages/home/Home"
import Skills from "./pages/skills/Skills"
import AddSkills from "./pages/skills/AddSkills"
import Experiences from "./pages/experience/Experiences"
import AddExperience from "./pages/experience/AddExperience"
import { Toaster } from "react-hot-toast"

function App() {

  return (
    <div className="App">
      <Toaster/>
      <Routes>
        <Route path="/login" element={<InverseProtected>
          <Login/>
        </InverseProtected>} />


        <Route path="/" element={<AppRoutes/>}>
          <Route index element={<Home/>}/>
          <Route path="/projects" element={<Projects/>}/>
          <Route path="/add-project" element={<AddProject/>}/>
          <Route path="/skills" element={<Skills/>}/>
          <Route path="/add-skill" element={<AddSkills/>}/>
          <Route path="/experiences" element={<Experiences/>}/>
          <Route path="/add-experience" element={<AddExperience/>}/>
        </Route>

      </Routes>
    </div>
  )
}

export default App
