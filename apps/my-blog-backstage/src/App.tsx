import { Outlet } from "react-router-dom"
import "./App.css"
function App() {

  return (
    <>
      <div className="app-box">
        <Outlet></Outlet>
      </div>
    </>
  )
}

export default App
