import { useState } from 'react'
import FormOrder from './components/FormOrder'
import AdminPage from './components/AdminPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('form') // 'form' or 'admin'

  return (
    <div className="App">
      <nav className="app-nav">
        <button 
          className={currentPage === 'form' ? 'active' : ''}
          onClick={() => setCurrentPage('form')}
        >
          Đặt hàng
        </button>
        <button 
          className={currentPage === 'admin' ? 'active' : ''}
          onClick={() => setCurrentPage('admin')}
        >
          Admin
        </button>
      </nav>
      
      {currentPage === 'form' ? <FormOrder /> : <AdminPage />}
    </div>
  )
}

export default App

