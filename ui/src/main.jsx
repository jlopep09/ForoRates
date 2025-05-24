import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router';
import { Profile } from './views/Profile.jsx';
import { Ranking } from './views/ranking/Ranking.jsx';
import  Thread  from './views/Thread.jsx';

createRoot(document.getElementById('root')).render(
      <BrowserRouter>
            <Routes >
                  <Route path="/" element={<App />} />
                  <Route path="profile" element={<Profile UserID={4}/>} />
                  <Route path="login" element={<App />} />
                  <Route path="register" element={<App/>} />
                  <Route path="ranking" element={<Ranking></Ranking>} />
            </Routes>
    </BrowserRouter>
)
