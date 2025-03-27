import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router';

createRoot(document.getElementById('root')).render(
      <BrowserRouter>
            <Routes>
                  <Route path="/" element={<App />} />
                  <Route path="profile" element={<App/>} />
                  <Route path="login" element={<App />} />
                  <Route path="register" element={<App/>} />
            </Routes>
    </BrowserRouter>
)
