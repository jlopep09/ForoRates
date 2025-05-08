import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router';
import { Profile } from './views/Profile.jsx';
import SignIn from './views/SignIn.jsx';
import SignUp from './views/SignUp.jsx';
import { Auth0Provider } from '@auth0/auth0-react';

createRoot(document.getElementById('root')).render(
      <BrowserRouter>
      <Auth0Provider
            domain="dev-wdgb4k4b1rj6fh7j.us.auth0.com"
            clientId="IKJXfU6Ff4iFycpcRh0XQC0RpbRNVYu5"
          authorizationParams={{
            redirect_uri: window.location.origin
          }}
        >
      <Routes >
            <Route path="/" element={<App />} />
            <Route path="profile" element={<Profile UserID={3}/>} />
            <Route path="login" element={<App />} />
            <Route path="register" element={<App/>} />
            <Route path="signin" element={<SignIn/>} />
            <Route path="signup" element={<SignUp/>} />
      </Routes>

      </Auth0Provider>

    </BrowserRouter>
)
