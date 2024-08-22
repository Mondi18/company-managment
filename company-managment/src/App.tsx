
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from "./components/Home";
import EmployeesEdit from './employees/employees-edit';

function App() {

  return (
    <div className='app'>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/employees-edit" element={<EmployeesEdit />} />
      </Routes>
    </div>
  )
}

export default App
