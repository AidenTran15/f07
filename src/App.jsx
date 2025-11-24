import { Routes, Route } from 'react-router-dom'
import FormOrder from './components/FormOrder'
import AdminPage from './components/AdminPage'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<FormOrder />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  )
}

export default App

