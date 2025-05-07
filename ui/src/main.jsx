import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router';
import { Profile } from './views/Profile.jsx';
import SignIn from './views/SignIn.jsx';
import SignUp from './views/SignUp.jsx';

createRoot(document.getElementById('root')).render(
      <BrowserRouter>
            <Routes >
                  <Route path="/" element={<App />} />
                  <Route path="profile" element={<Profile UserID={3}/>} />
                  <Route path="login" element={<App />} />
                  <Route path="register" element={<App/>} />
                  <Route path="signin" element={<SignIn/>} />
                  <Route path="signup" element={<SignUp/>} />
            </Routes>
    </BrowserRouter>
)
