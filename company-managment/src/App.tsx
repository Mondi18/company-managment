
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from "./components/Home";
import EmployeesEdit from './employees/employees-edit';
import { AuthProvider } from './auth/auth-provider';
function App() {

  return (
    <div className='app'>
    <AuthProvider>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/employees-edit" element={<EmployeesEdit />} />
      </Routes>
    </AuthProvider>
    </div>
  )
}

export default App
